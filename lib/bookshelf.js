import knex from 'knex';
import bookshelf from 'bookshelf';
import config from '../knexfile';

const connection = knex(config);

export default bookshelf(connection);
