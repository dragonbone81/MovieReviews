const auth = require("../auth");

module.exports.jwtCheck = (req, res, next) => {
    const {token} = req.headers;
    if (!token) {
        res.json({error: "no_token"});
        return;
    }
    const verifiedJWT = auth.verifyJWT(token);
    if (verifiedJWT.success) {
        req.username = verifiedJWT.username;
        next();
    } else {
        res.json({error: "invalid_token"});
    }
};
module.exports.jwtCheckWithNoToken = (req, res, next) => {
    const {token} = req.headers;
    if (!token) {
        req.no_token = true;
        next();
    }
    const verifiedJWT = auth.verifyJWT(token);
    if (verifiedJWT.success) {
        req.username = verifiedJWT.username;
        next();
    } else {
        req.no_token = true;
        next();
    }
};