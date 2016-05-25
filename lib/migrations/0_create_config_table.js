export function up(knex) {
  return knex.schema.createTable('config', (table) => {
    table.increments('id').primary();
    table.string('key');
    table.json('value');
  });
}

export function down(knex) {
  return knex.schema.dropTable('config');
}
