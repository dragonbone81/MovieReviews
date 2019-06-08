exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.dropUnique(['movie_id', 'username']);
            // table.unique(['movie_id', 'username', 'type']);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            // table.dropUnique(['movie_id', 'username', 'type']);
            table.unique(['movie_id', 'username']);
        })
    ]);
};
