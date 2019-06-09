exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('v_rating', table => {
            table.integer('season').defaultTo(-1);
            table.dropUnique(['movie_id', 'type']);
            table.unique(['movie_id', 'type', 'season']);
        }),
        knex.schema.alterTable('movie_interaction', table => {
            table.integer('season').defaultTo(-1);
            table.dropUnique(['movie_id', 'username', 'type']);
            table.unique(['movie_id', 'username', 'type', 'season']);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('v_rating', table => {
            table.dropUnique(['movie_id', 'type', 'season']);
            table.dropColumn('season');
            table.unique(['movie_id', 'type']);
        }),
        knex.schema.alterTable('movie_interaction', table => {
            table.dropUnique(['movie_id', 'username', 'type', 'season']);
            table.dropColumn('season');
            table.unique(['movie_id', 'username', 'type']);
        })
    ]);
};
