const express = require('express');
const router = express.Router();
const auth = require('./auth');
const User = require('./models');

router.post('/signUp', async (req, res) => {
    const user = req.body.user;
    if (!user || !('username' in user) || !('password' in user) || !('email' in user)) {
        res.json({error: 'bad_request'});
        return;
    }
    user.password = await auth.hashPassword(user.password);
    const token = auth.signJWT(user.username);
    const newUser = new User({
        username: user.username,
        email: user.email,
        password: user.password,
    });
    try {
        await newUser.save();
        res.json({success: true, user: {username: user.username, email: user.email, token}});
    } catch (e) {
        if (e.code === 11000) {
            res.json({error: 'duplicate_user'})
        }
        else {
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
    const foundUser = await User.findOne({username: user.username});
    console.log(foundUser);
    if (!foundUser) {
        res.json({error: 'User not Found.'});
        return;
    }
    if (await auth.comparePassword(user.password, foundUser.password)) {
        const token = auth.signJWT(user.username);
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