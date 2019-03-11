const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Game = require('./game/gameModel');
const games = require('./games');

const userRoutes = require('./user/UserRoutes');
const pickRouter = require('./pick/pickRoutes');
const gameRouter = require('./game/gameRoutes');
const leagueRouter = require('./league/leagueRoutes');
// const customFoodRouter = require('./customFood/CustomFoodRoutes');
// const systemFoodRouter = require('./systemFood/SystemFoodRoutes');

const server = express();

server.use(cors());   // https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(bodyParser.json());

server.get('/', function (req, res) {
    res.status(200).json({ status: 'API Running' });
});

mongoose
    .connect('mongodb://lys:lys916@ds161335.mlab.com:61335/nflpick')

    .then(conn => {
        console.log('connected to mongo nflpick');
    })
    .catch(err => {
        console.log('error connect to mongo');
    });

server.use('/user', userRoutes);
server.use('/pick', pickRouter);
server.use('/game', gameRouter);
server.use('/league', leagueRouter);
// server.use('/customFood', customFoodRouter);
// server.use('/systemFood', systemFoodRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`API running on http://localhost:${port}.`);

    // uncomment and restart server to add system foods
    // addSystemFood(); 
    // console.log('gamesxxxx', games);


    // Game.create(games, function () {
    //     console.log('inserted');
    // });


});