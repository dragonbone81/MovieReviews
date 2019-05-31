const express = require('express');
const router = express.Router();
const jwtCheck = require('./middleware/checkJWT');
const User = require('./models');

router.post('/user/movie', jwtCheck, async (req, res) => {
    const {movie_id} = req.body;
    const movie = await User.findOne({username: req.username, "movies.movie_id": movie_id}, {'movies.$': 1});
    if (movie) {
        res.json({movie: movie.movies[0]});
    } else {
        res.json({movie: {}});
    }
});
router.post('/user/movie/update_bool', jwtCheck, async (req, res) => {
    const {movie_id, type, value} = req.body;
    const updateQuery = {movie_id};
    updateQuery[type] = value;
    // console.log(updateQuery);
    const result = await User.updateOne({username: req.username, "movies.movie_id": {$ne: movie_id}}, {
            $push: {'movies': updateQuery}
        },
    );
    if (result.nModified === 0) { //means that one already exists
        const updateQ = {};
        updateQ[`movies.$.${type}`] = value;
        console.log(updateQ)
        const update = await User.updateOne({username: req.username, "movies.movie_id": movie_id}, {
                $set: updateQ,
            },
        );
        // console.log(update)
    }
    // console.log(user);
    // console.log(user, "here");
    // const foundUser = await User.findOne({username: req.username});
    // console.log(foundUser)
    res.json({movie: {}})
    // if (movie_id in data.movies) {
    //     const movies_proj = {};
    //     movies_proj[`movies.${movie_id}`] = 1;
    //     const returnd = await (await dbClient).updateOne(
    //         {
    //             $and:
    //                 [
    //                     {"user.username": req.username},
    //                 ]
    //         },
    //         {
    //             $set: {
    //                 [`movies.${movie_id}.like`]: like
    //             }
    //         }
    //     );
    //     res.json({movie: {}});
    // } else {
    //     const movies_proj = {};
    //     movies_proj[`movies.${movie_id}`] = 1;
    //     const returnd = await (await dbClient).updateOne(
    //         {
    //             $and:
    //                 [
    //                     {"user.username": req.username},
    //                 ]
    //         },
    //         {
    //             $set: {
    //                 [`movies.${movie_id}.like`]: like,
    //                 [`movies.${movie_id}.view`]: false,
    //                 [`movies.${movie_id}.save`]: false,
    //             }
    //         }
    //     );
    //     res.json({movie: {}})
    // }
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