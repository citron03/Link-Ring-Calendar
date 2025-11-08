import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
// In production, prefer .env.production, but fallback to .env
// In development, prefer .env.development, but fallback to .env
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env.development';

// Try to load environment-specific file first
dotenv.config({ path: path.resolve(__dirname, '..', '..', envFile) });
// Also load .env if it exists (takes precedence over env-specific files)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173'),
};

