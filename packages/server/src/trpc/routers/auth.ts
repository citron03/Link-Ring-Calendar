import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { router, publicProcedure } from '../trpc';
import { config } from '../../config/env';

const JWT_SECRET = config.jwtSecret;

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        nickname: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, nickname } = input;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          nickname,
        },
      });

      return { message: 'User created successfully' };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      // Store refresh token in DB
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

      // Set HttpOnly cookie for refresh token
      ctx.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.nodeEnv === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, nickname: user.nickname },
      };
    }),

  refresh: publicProcedure.mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies?.refreshToken || ctx.req.body?.refreshToken;
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: number };

      const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!stored || stored.userId !== decoded.userId) {
        throw new Error('Invalid refresh token');
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Rotate refresh token
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      const newRefreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: user.id, expiresAt } });

      const newAccessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      // Set new refresh token cookie
      ctx.res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.nodeEnv === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies?.refreshToken || ctx.req.body?.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      ctx.res.clearCookie('refreshToken');
    }
    return { message: 'Logged out' };
  }),
});

