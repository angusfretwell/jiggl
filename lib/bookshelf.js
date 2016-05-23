import knex from 'knex';
import bookshelf from 'bookshelf';
import jsonColumns from 'bookshelf-json-columns';
import config from '../knexfile';

const connection = knex(config);
const shelf = bookshelf(connection);

shelf.plugin(jsonColumns);

export default shelf;
