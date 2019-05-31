exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.decimal('rating', 3, 1).nullable().defaultTo(null);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.dropColumn('rating');
        })
    ]);
};
