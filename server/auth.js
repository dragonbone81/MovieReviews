const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./secrets');

module.exports.hashPassword = (password) => {
    return bcrypt.hash(password, 8);
};
module.exports.comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
module.exports.signJWT = (username) => {
    return jwt.sign({username: username}, SECRET_KEY, {
        expiresIn: 86400 * 365 * 10 // expires in 10 years
    });
};
module.exports.verifyJWT = (token) => {
    try {
        return {success: true, username: jwt.verify(token, SECRET_KEY).username};
    } catch (e) {
        return {error: e};
    }
};