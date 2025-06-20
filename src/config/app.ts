import * as process from 'process';

export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  BCRYPT: {
    HASH_ROUNDS: Number(process.env.BCRYPT_HASH_ROUNDS || 10),
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  CLERK_CUSTOM_TEMPLATE: process.env.CLERK_CUSTOM_TEMPLATE || 'test',
});
