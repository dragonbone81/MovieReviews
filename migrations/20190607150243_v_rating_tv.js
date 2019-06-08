exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('v_rating', table => {
            table.dropPrimary();
            table.string('type').defaultTo('movie');
            table.unique(['movie_id', 'type']);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('v_rating', table => {
            table.dropUnique(['movie_id', 'type']);
            table.string('type').alter();
            table.integer('movie_id').primary();
        })
    ]);
};
