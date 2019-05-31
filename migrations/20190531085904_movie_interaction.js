exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.unique(['username, movie_id'])
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.unique(['username, movie_id']).alter()
        })
    ])
};