import './bootstrap';

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: process.env.APP_DEBUG,

  migrations: {
    tableName: 'migrations',
    directory: './lib/migrations',
  },

  seeds: {
    directory: './lib/seeds',
  },
};
