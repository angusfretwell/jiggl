import bookshelf from '../bookshelf';

export const Config = bookshelf.Model.extend({
  tableName: 'config',
});

export const Configs = bookshelf.Collection.extend({
  model: Config,
});
