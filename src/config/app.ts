import * as process from 'process';

export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  BCRYPT: {
    HASH_ROUNDS: Number(process.env.BCRYPT_HASH_ROUNDS || 10),
  },
});
