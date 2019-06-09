const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log("Server Started!"));
const client = require('./server/db_connection');
const authRoutes = require('./server/authRoutes');
const movieRoutes = require('./server/movieRoutes');
const {User, MovieInteraction, V_Rating} = require('./server/models');

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(authRoutes);
app.use(movieRoutes);


app.get('/', async (req, res) => {
    const x = await MovieInteraction.query()
    // .findById(["abc", 63247, 'tv'])
        .where({username: "abc", type: "season", season: 1, movie_id:68638})
        // .delete();
    console.log(x);
    // await V_Rating.query().insert({movie_id: 299534, rating: 3});
    // await User.query().insert({username: "dragonbone81", email: "test", password: "test"})
    // const user = await User.query()
    //     .eager('movies')
    //     .where("username", "dragonbone81");
    // const x = await user[0]
    //     .$relatedQuery('movies')
    //     .insert({movie_id: 125});

    // const user = await User.query().delete().where("username", "dragonbone81");
    // res.json(user);
    res.json({asd: "asd", db: "hi"});
});