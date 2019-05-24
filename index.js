const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log("Server Started!"));
const client = require('./server/db_connection');
const authRoutes = require('./server/authRoutes');

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(authRoutes);


app.get('/', async (req, res) => {
    res.json({asd: "asd", db: "hi"});
});