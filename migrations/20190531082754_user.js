exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('user', table => {
            table.increments('id').primary();
            table.string('username').unique();
            table.string('email');
            table.string('password');
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('user')
    ])
};
