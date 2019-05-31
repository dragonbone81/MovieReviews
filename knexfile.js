// Update with your config settings.
const {DB_URL} = require('./server/secrets');
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {
    client: 'pg',
    connection: DB_URL
};