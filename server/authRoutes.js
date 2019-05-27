const express = require('express');
const router = express.Router();
const jwtCheck = require('./middleware/checkJWT');
const dbClient = require('./db_connection');
const auth = require('./auth');

router.post('/signUp', async (req, res) => {
    const user = req.body.user;
    if (!user || !('username' in user) || !('password' in user) || !('email' in user)) {
        res.json({error: 'bad_request'});
        return;
    }
    const duplicateUser = await (await dbClient).findOne(
        {"user.username": user.username}
    );
    if (duplicateUser) {
        res.json({error: 'duplicate_user'});
        return;
    }
    user.password = await auth.hashPassword(user.password);
    const token = auth.signJWT(user.username);
    await (await dbClient).insertOne({
        user,
    });
    res.json({success: true, user: {username: user.username, email: user.email, token}});
});

router.post('/login', async (req, res) => {
    const user = req.body.user;
    if (!user || !('username' in user) || !('password' in user)) {
        res.json({error: 'bad_request'});
        return;
    }
    const foundUser = await (await dbClient).findOne(
        {"user.username": user.username}
    );
    if (!foundUser) {
        res.json({error: 'User not Found.'});
        return;
    }
    if (await auth.comparePassword(user.password, foundUser.user.password)) {
        const token = auth.signJWT(user.username);
        res.json({
            success: true,
            user: {
                token,
                username: foundUser.user.username,
                email: foundUser.user.email,
            }
        });
    } else {
        res.json({error: 'Incorrect Password.'});
    }
});
module.exports = router;