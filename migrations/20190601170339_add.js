exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.timestamps(true, true)
        }),
        knex.schema.alterTable('user', table => {
            table.timestamps(true, true)
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.dropColumn('created_at');
            table.dropColumn('updated_at');
        }),
        knex.schema.alterTable('user', table => {
            table.dropColumn('created_at');
            table.dropColumn('updated_at');
        })
    ]);
};
