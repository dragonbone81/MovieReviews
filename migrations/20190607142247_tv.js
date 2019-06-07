exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.string('type').defaultTo('movie');
            table.unique(['movie_id', 'username', 'type']);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.string('type').alter();
            table.unique(['movie_id', 'username']);
        })
    ]);
};
