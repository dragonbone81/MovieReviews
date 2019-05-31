exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('user', table => {
            table.string('username').primary();
            table.string('email');
            table.string('password');
        }),
        knex.schema.createTable('movie_interaction', table => {
            table.string('username').references('user.username').onDelete('CASCADE');
            table.integer('movie_id');
            table.boolean('liked').defaultTo(false);
            table.boolean('viewed').defaultTo(false);
            table.boolean('saved').defaultTo(false);
            table.unique(['movie_id', 'username']);
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('movie_interaction'),
        knex.schema.dropTable('user'),
    ]);
};
