exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.string('release_date').defaultTo("");
            table.string('title').defaultTo("");
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.dropColumn('release_date');
            table.dropColumn('title');
        })
    ]);
};
