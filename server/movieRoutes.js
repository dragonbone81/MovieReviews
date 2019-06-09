const express = require('express');
const router = express.Router();
const jwtCheck = require('./middleware/checkJWT');
const {MovieInteraction, V_Rating} = require('./models');

router.get('/user/movie/:id', jwtCheck.jwtCheckWithNoToken, async (req, res) => {
    const {id} = req.params;
    const type = req.query.type || "movie";
    const season = req.query.season || -1;
    if (req.no_token) {
        const allQueries = await Promise.all([
            MovieInteraction.query()
                .columns("rating")
                .count()
                .havingNotNull("rating")
                .where({movie_id: id, type, season}).groupBy("rating"),
            V_Rating.query()
                .findById([id, type, season])
                .column("rating"),
            MovieInteraction.query()
                .where({movie_id: id, type, season})
                .whereNotNull("rating")
                .count()
                .as('total_ratings'),
            MovieInteraction.query()
                .where({movie_id: id, type, season}).avg("rating")
                .as('average_rating'),
        ]);
        res.json({
            movie: {
                rating_groups: allQueries[0],
                v_rating: allQueries[1],
                total_ratings: allQueries[2] ? allQueries[2][0].count : 0,
                average_rating: allQueries[3] ? allQueries[3][0].avg : undefined
            }
        });
    } else {
        const allQueries = await Promise.all([
            MovieInteraction.query()
                .findById([req.username, id, type, season])
                .columns(MovieInteraction.query()
                        .where({movie_id: id, type, season}).avg("rating")
                        .as('average_rating'),
                    MovieInteraction.query()
                        .where({movie_id: id, type, season})
                        .whereNotNull("rating")
                        .count()
                        .as('total_ratings'),
                    "*"),
            MovieInteraction.query()
                .columns("rating")
                .count()
                .havingNotNull("rating")
                .where({movie_id: id, type, season}).groupBy("rating"),
            V_Rating.query()
                .findById([id, type, season])
                .column("rating")
        ]);
        res.json({movie: {...allQueries[0], rating_groups: allQueries[1], v_rating: allQueries[2]}});
    }
});
router.get('/user/review/:movie_id/:username', async (req, res) => {
    const {movie_id, username} = req.params;
    const type = req.query.type;
    const season = ((req.query.season && req.query.season !== "undefined") && req.query.season) || -1;
    const movie = await MovieInteraction.query()
        .findById([username, movie_id, type, season])
        .andWhere((table) => {
            table.whereNotNull("review");
            table.orWhereNotNull("rating");
        });
    res.json({movie});
});
router.get('/recent/reviews', async (req, res) => {
    const type = req.query.type;
    const movie = await MovieInteraction.query()
        .where({type})
        .andWhere((table) => {
            table.whereNotNull("review");
            table.orWhereNotNull("rating");
        })
        .orderBy("created_at", "desc")
        .limit(4);
    res.json({movie});
});
router.post('/user/movie/update/date_content', jwtCheck.jwtCheck, async (req, res) => {
    const {movie_id, date_watched, review, type, season} = req.body;
    try {
        await MovieInteraction.query().upsertGraph({
            movie_id, username: req.username, date_watched, review, type, season: season || -1
        }, {insertMissing: true, noDelete: true});
        res.json({success: true})
    } catch (e) {
        res.json({})
    }
});
router.post('/user/movie/update/v_review', jwtCheck.jwtCheck, async (req, res) => {
    if (req.username !== "dragonbone81") {
        res.json({});
        return;
    }
    const {movie_id, v_review, type, season} = req.body;
    try {
        await V_Rating.query().upsertGraph({
            movie_id, rating: v_review, type, season: season || -1
        }, {insertMissing: true, noDelete: true});
        res.json({success: true})
    } catch (e) {
        res.json({})
    }
});
router.post('/user/movie/update', jwtCheck.jwtCheck, async (req, res) => {
    const {movie_id, type, value, entityType, season} = req.body;
    if (!entityType) {
        res.json({error: true});
    }
    const query = {username: req.username, movie_id};
    query[type] = value;
    await MovieInteraction.query().upsertGraph({
        username: req.username,
        movie_id, ...query, type: entityType, season: season || -1
    }, {insertMissing: true, noDelete: true});
    res.json({success: true})
});
router.get('/user/movies/watched/:username', async (req, res) => {
    const {username} = req.params;
    const page = req.query.page || 0;
    const sort_type = req.query.sort_type || "created_at";
    const sort_direction = req.query.sort_direction || "desc";
    let type = req.query.type || "all";
    if (type === "all") {
        type = ["movie", "tv", "season"];
    } else {
        type = [type];
    }
    const movies = await MovieInteraction.query()
        .where({username})
        .whereIn("type", type)
        .andWhere((table) => {
            table.where({viewed: true});
            table.orWhereNotNull("date_watched");
            table.orWhereNotNull("review");
            table.orWhereNotNull("rating");
        })
        .page(page, 10)
        .orderBy(sort_type || "created_at", sort_direction || "desc");
    res.json({success: true, movies})
});
router.get('/user/movies/history/:username', async (req, res) => {
    const {username} = req.params;
    const page = req.query.page || 0;
    let sort_type = req.query.sort_type || "created_at";
    let sort_direction = req.query.sort_direction || "desc";
    if (sort_type === "created_at") {
        sort_type = "date_watched";
    }
    let type = req.query.type || "all";
    if (type === "all") {
        type = ["movie", "tv", "season"];
    } else {
        type = [type];
    }
    const movies = await MovieInteraction.query()
        .where({username})
        .whereIn("type", type)
        .whereNotNull("date_watched")
        .page(page, 10)
        .orderBy(sort_type || "date_watched", sort_direction || "desc");
    res.json({success: true, movies})
});
router.get('/user/movies/reviews/:username', async (req, res) => {
    const {username} = req.params;
    const page = req.query.page || 0;
    const sort_type = req.query.sort_type || "created_at";
    const sort_direction = req.query.sort_direction || "desc";
    let type = req.query.type || "all";
    if (type === "all") {
        type = ["movie", "tv", "season"];
    } else {
        type = [type];
    }
    const movies = await MovieInteraction.query()
        .where({username})
        .whereIn("type", type)
        .andWhere((table) => {
            table.whereNotNull("review");
            table.orWhereNotNull("rating");
        })
        .page(page, 10)
        .orderBy(sort_type || "created_at", sort_direction || "desc");
    res.json({success: true, movies})
});
router.get('/user/movies/ratings/:username', async (req, res) => {
    const {username} = req.params;
    const page = req.query.page || 0;
    const movies = await MovieInteraction.query()
        .where({username, type: "movie"})
        .whereNotNull("review")
        .page(page, 10)
        .orderBy("created_at", "desc");
    res.json({success: true, movies})
});
module.exports = router;