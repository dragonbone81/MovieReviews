exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('v_rating', table => {
            table.integer('movie_id').primary();
            table.integer('rating');
            table.timestamps(true, true);
        }),
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('v_rating'),
    ]);
};
