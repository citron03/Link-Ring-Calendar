import express from 'express';
import cors from 'cors';
import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { z } from 'zod';

const t = initTRPC.create();

const appRouter = t.router({
  getEvents: t.procedure
    .input(z.object({}).optional())
    .query(() => {
      // mock data
      return [
        { id: '1', title: 'Planning meeting', date: '2025-11-05' },
        { id: '2', title: 'Design review', date: '2025-11-08' }
      ];
    }),
  getHello: t.procedure.query(() => ({ msg: 'Hello from mock server' }))
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => null
  })
);

const port = 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock server listening: http://localhost:${port}/trpc`);
});
