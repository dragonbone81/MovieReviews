const express = require('express');
const router = express.Router();
const jwtCheck = require('./middleware/checkJWT');
const {User, MovieInteraction} = require('./models');

router.post('/user/movie', jwtCheck, async (req, res) => {
    const {movie_id} = req.body;
    const movie = await MovieInteraction.query().findById([req.username, movie_id]);
    console.log(movie);
    res.json({movie: {...movie}});
});
router.post('/user/movie/update/date_content', jwtCheck, async (req, res) => {
    const {movie_id, date_watched, review} = req.body;
    try {
        await MovieInteraction.query().upsertGraph({
            movie_id, username: req.username, date_watched, review,
        }, {insertMissing: true, noDelete: true});
        res.json({success: true})
    } catch (e) {
        res.json({})
    }
});
router.post('/user/movie/update', jwtCheck, async (req, res) => {
    const {movie_id, type, value} = req.body;
    const query = {username: req.username, movie_id};
    query[type] = value;
    await MovieInteraction.query().upsertGraph({
        username: req.username,
        movie_id, ...query
    }, {insertMissing: true, noDelete: true});
    res.json({success: true})
});
router.get('/user/movies/watched/:username', async (req, res) => {
    const {username} = req.params;
    const page = req.query.page || 0;
    const movies = await MovieInteraction.query()
        .where({username})
        .andWhere((table) => {
            table.where({viewed: true});
            table.orWhereNotNull("date_watched");
            table.orWhereNotNull("review");
        })
        .page(page, 10)
        .orderBy("updated_at", "desc");
    res.json({success: true, movies})
});
module.exports = router;