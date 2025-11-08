import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

const JWT_SECRET = config.jwtSecret;

export async function createContext({ req, res }: CreateExpressContextOptions) {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  let user: { userId: number; email: string } | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      user = { userId: decoded.userId, email: decoded.email };
    } catch (error) {
      // Invalid token, user remains null
    }
  }

  return {
    req,
    res,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

