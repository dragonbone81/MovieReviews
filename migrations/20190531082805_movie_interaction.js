exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('movie_interaction', table => {
            table.increments('id').primary();
            table.string('username')
            table.integer('movie_id')
            // table.unique(['username, movie_id'])
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('movie_interaction')
    ])
};
