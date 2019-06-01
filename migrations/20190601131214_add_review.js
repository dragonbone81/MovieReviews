exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.date("date_watched").nullable();
            table.text("review").nullable();
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('movie_interaction', table => {
            table.dropColumn('date_watched');
            table.dropColumn('review');
        })
    ]);
};
