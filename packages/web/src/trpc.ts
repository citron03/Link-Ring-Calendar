import { createTRPCReact } from '@trpc/react-query';
import { httpLink } from '@trpc/client';
import type { AppRouter } from '@link-ring/calendar-server';
import { QueryClient } from '@tanstack/react-query';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return import.meta.env.VITE_API_URL || 'http://localhost:4000';
  }
  // SSR should use absolute URL
  return process.env.VITE_API_URL || 'http://localhost:4000';
};

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/trpc`,
      // Include credentials for cookies (refresh token)
      credentials: 'include',
      headers: () => {
        const token = localStorage.getItem('accessToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
