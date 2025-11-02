import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import quickLinksRouter from './routes/quicklinks';
import schedulesRouter from './routes/schedules';
import authRouter from './routes/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

if (!process.env.DATABASE_URL) {
  console.warn('[server] WARNING: DATABASE_URL is not set. Prisma requests will fail until you set DATABASE_URL in packages/server/.env or environment. For quick testing you can set DATABASE_URL="file:./dev.db"');
}

// Routes
app.use('/api/auth', authRouter);
app.use('/api/quicklinks', quickLinksRouter);
app.use('/api/schedules', schedulesRouter);

const port = 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});
