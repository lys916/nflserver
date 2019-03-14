const express = require('express');
const League = require('./leagueModel.js');
const Game = require('../game/gameModel.js');
const Season = require('../season/seasonModel.js');
const User = require('../user/UserModel.js');
const leagueRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

leagueRouter.post('/create', function (req, res) {
    console.log('create league route hit');
    const { name, pin, weeks, notes, user, weekValues } = req.body;

    const league = new League({ name, pin, weeks, notes, });
    league.users = [user];
    league.admin = user;

    // find all game that has a week value of the array of week number
    Game.find({ week: { $in: weekValues } }, '_id').then(games => {
        // grab game ids and insert them into league games
        league.games = [];
        for (let i = 0; i < games.length; i++) {
            league.games.push(games[i]._id);
        }

        Season.findOne({ active: true }).then(season => {
            league.season = season._id;

            // save league
            league.save().then(savedLeague => {
                // update user with league data
                User.findById(user).then(user => {
                    if (user) {
                        user.leagues.push(savedLeague._id);
                        user.currentLeague = savedLeague._id;
                        user.save().then(updatedUser => {
                            res.json(updatedUser);
                        });
                    } else {
                        res.json({ errorMessage: 'Unable to find user while creating a league.' });
                    }
                });
            });

        });


    });







});

leagueRouter.post('/join', function (req, res) {
    const { id, pin, user } = req.body;

    League.findOne({ leagueId: id }).then(league => {
        if (league) {
            if (pin === league.pin) {
                league.users.push(user);
                league.save().then(leagueSaved => {
                    User.findById(user).then(user => {
                        if (user) {
                            user.leagues.push(league._id);
                            user.currentLeague = league._id;
                            user.save().then(updatedUser => {
                                res.json(updatedUser);
                            });
                        } else {
                            res.json({ errorMessage: 'Unable to find user while joining a league.' });
                        }
                    });
                });
            } else {
                res.json({ errorMessage: 'PIN is incorrect, please check and try again.' });
            }

        } else {
            res.json({ errorMessage: 'Unable to find league, check the league ID and try again.' });
        }
    });

    // // save league
    // league.save().then(savedLeague => {
    //     // update user with league data
    //     User.findById(user).then(user => {
    //         if (user) {
    //             user.leagues.push(savedLeague._id);
    //             user.currentLeague = savedLeague._id;
    //             user.admin = true;
    //             user.save().then(updatedUser => {
    //                 res.json(updatedUser);
    //             });
    //         } else {
    //             res.json({ errorMessage: 'Unable to find user while creating a league.' });
    //         }
    //     });
    // });
});



leagueRouter.get('/fetch/:id', function (req, res) {
    console.log('fetching league id', req.params);
    // const { date, userName } = req.query;
    // console.log('get food data', req.body)
    League.findById(req.params.id)
        .populate('games')
        .populate({
            path: 'picks',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        .populate({
            path: 'picks',
            populate: {
                path: 'game',
                model: 'Game'
            }
        })
        .populate('season')
        .populate('users')
        .populate('admin')
        .then(league => {
            console.log('first game', league.games[0]);
            res.json(league);
        });
});

// userRouter.post('/login', function (req, res) {
//     console.log('user logging in', req.body);
//     const { email, password } = req.body;
//     User.findOne({ email }).then(user => {
//         if (!user) {
//             res.json({ errorMessage: 'Wrong username or password' });
//         }
//         if (user) {
//             console.log('found user', user);
//             bcrypt.compare(password, user.password, function (err, valid) {
//                 if (!valid) {
//                     res.json({ errorMessage: 'Wrong username or password' });
//                 }
//                 console.log('pwd valid', true)
//                 // const token = jwt.sign(user, 'This is a secret string', { expiresIn: '1h' });
//                 // res.json({ token: token, username: user.name, email: user.email });
//                 res.json(user);
//             });
//         }
//     });
// });

// userRouter.get('/', function (req, res) {
//     console.log('getting users');
//     User.find({}).sort('dateCreated').then(users => {
//         res.json(users);
//     });
// });


module.exports = leagueRouter;