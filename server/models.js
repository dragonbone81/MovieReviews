const mongoose = require('mongoose');
const Movie = mongoose.Schema({
    movie_id: Number,
    liked: Boolean,
    viewed: Boolean,
    saved: Boolean,
    _id: false,
});
const User = mongoose.Schema({
    username: {type: String, unique: true},
    email: String,
    password: String,
    movies: [Movie]
});
// User.add({asd: String,});

module.exports = mongoose.model('User', User);