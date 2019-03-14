const express = require('express');
const seasonRouter = express.Router();

const Season = require('./seasonModel');

// pickRouter.post('/create', function (req, res) {
//     console.log('creating a pick', req.body);
//     Pick.create(req.body).then(pick => {
//         res.json(pick);
//     });
// });

seasonRouter.get('/', function (req, res) {

    Season.find().then(season => {
        res.json(season[0]);
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

module.exports = seasonRouter;