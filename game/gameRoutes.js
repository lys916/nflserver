const express = require('express');
const gameRouter = express.Router();

const Game = require('./gameModel');

// pickRouter.post('/create', function (req, res) {
//     console.log('creating a pick', req.body);
//     Pick.create(req.body).then(pick => {
//         res.json(pick);
//     });
// });

gameRouter.get('/fetch/:week', function (req, res) {
    console.log('fetching games week', req.params);
    // const { date, userName } = req.query;
    // console.log('get food data', req.body)
    Game.find({ week: req.params.week }).then(games => {
        res.json(games);
    });
});

// pickRouter.post('/delete', function (req, res) {
//     const { id } = req.body;
//     Pick.findByIdAndRemove(id).then(deleted => {
//         res.json(deleted);
//     });
// });

// pickRouter.post('/update', function (req, res) {
//     const { id } = req.body;
//     Pick.findById(id).then(pick => {
//         pick.selected = pick.selected === 'home' ? 'road' : 'home';
//         pick.save().then(updated => {
//             res.json(updated);
//         });

//     });
// });

module.exports = gameRouter;