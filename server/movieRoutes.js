const express = require('express');
const router = express.Router();
const jwtCheck = require('./middleware/checkJWT');
const {User, MovieInteraction} = require('./models');

router.post('/user/movie', jwtCheck, async (req, res) => {
    const {movie_id} = req.body;
    const movie = await MovieInteraction.query().findById([req.username, movie_id]);
    console.log(movie);
    res.json({movie});
});
router.post('/user/movie/update_bool', jwtCheck, async (req, res) => {
    const {movie_id, type, value} = req.body;
    const query = {username: req.username, movie_id};
    query[type] = value;
    await MovieInteraction.query().upsertGraph({
        username: req.username,
        movie_id, ...query
    }, {insertMissing: true, noDelete: true});
    res.json({success: true})
});
module.exports = router;