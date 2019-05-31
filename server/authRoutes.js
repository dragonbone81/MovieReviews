const express = require('express');
const router = express.Router();
const auth = require('./auth');
const {User} = require('./models');

router.post('/signUp', async (req, res) => {
    const user = req.body.user;
    if (!user || !('username' in user) || !('password' in user) || !('email' in user)) {
        res.json({error: 'bad_request'});
        return;
    }
    user.password = await auth.hashPassword(user.password);
    const token = auth.signJWT(user.username);
    try {
        const newUser = await User.query().insert({
            username: user.username,
            password: user.password,
            email: user.email
        });
        res.json({success: true, user: {username: newUser.username, email: newUser.email, token}});
    } catch (e) {
        if (e.constraint === 'user_username_unique') {
            res.json({error: 'duplicate_user'})
        } else {
            res.json({error: 'unknown'})
        }
    }
});

router.post('/login', async (req, res) => {
    const user = req.body.user;
    if (!user || !('username' in user) || !('password' in user)) {
        res.json({error: 'bad_request'});
        return;
    }
    const foundUser = await User.query().findById(user.username);
    if (!foundUser) {
        res.json({error: 'User not Found.'});
        return;
    }
    if (await auth.comparePassword(user.password, foundUser.password)) {
        const token = auth.signJWT(foundUser.username);
        res.json({
            success: true,
            user: {
                token,
                username: foundUser.username,
                email: foundUser.email,
            }
        });
    } else {
        res.json({error: 'Incorrect Password.'});
    }
});
module.exports = router;