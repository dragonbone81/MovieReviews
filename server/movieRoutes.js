const express = require('express');
const router = express.Router();
const jwtCheck = require('./middleware/checkJWT');
const dbClient = require('./db_connection');
const auth = require('./auth');

router.post('/movie', jwtCheck, async (req, res) => {
    const {movie_id} = req.body;
    const data = await check_if_movie_exists(movie_id, req.username);
    if (movie_id in data.movies) {
        res.json({movie: data.movies[movie_id]});
    } else {
        res.json({movie: {}})
    }
});
router.post('/movie/like', jwtCheck, async (req, res) => {
    const {movie_id, like} = req.body;
    const data = await check_if_movie_exists(movie_id, req.username);
    console.log(data);
    if (movie_id in data.movies) {
        const movies_proj = {};
        movies_proj[`movies.${movie_id}`] = 1;
        const returnd = await (await dbClient).updateOne(
            {
                $and:
                    [
                        {"user.username": req.username},
                    ]
            },
            {
                $set: {
                    [`movies.${movie_id}.like`]: like
                }
            }
        );
        res.json({movie: {}});
    } else {
        const movies_proj = {};
        movies_proj[`movies.${movie_id}`] = 1;
        const returnd = await (await dbClient).updateOne(
            {
                $and:
                    [
                        {"user.username": req.username},
                    ]
            },
            {
                $set: {
                    [`movies.${movie_id}.like`]: like,
                    [`movies.${movie_id}.view`]: false,
                    [`movies.${movie_id}.save`]: false,
                }
            }
        );
        res.json({movie: {}})
    }
});
const check_if_movie_exists = async (movie_id, username) => {
    const movies_proj = {};
    movies_proj[`movies.${movie_id}`] = 1;
    return await (await dbClient).findOne(
        {"user.username": username},
        {fields: movies_proj},
    );
};
module.exports = router;