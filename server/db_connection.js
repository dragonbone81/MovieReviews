const mongoose = require('mongoose');
const {DB_URL} = require('./secrets');

// Use connect method to connect to the Server
const client = mongoose.connect(DB_URL, {useNewUrlParser: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);