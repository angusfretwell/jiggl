import './bootstrap';

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,

  migrations: {
    tableName: 'migrations',
    directory: './lib/migrations',
  },

  seeds: {
    directory: './lib/seeds',
  },
};
