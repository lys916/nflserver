const express = require('express');
const User = require('./UserModel.js');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

userRouter.post('/signup', function (req, res) {
    console.log('sign up route hit');
    const { email, password, name } = req.body;
    User.find({ email }).then(userFound => {
        console.log('user found', userFound);
        if (userFound.length > 0) {
            res.json({ errorMessage: 'You already have an account with his email. Please log in.' })
        } else {
            console.log('creating user');
            const user = new User();
            user.email = email;
            user.name = name;
            user.password = password

            bcrypt.hash(password, 11, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                user.save().then(savedUser => {
                    console.log('user is saved');
                    res.json(savedUser);
                });
            });
        }
    })

});

userRouter.post('/login', function (req, res) {
    console.log('user logging in', req.body);
    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
        if (!user) {
            res.json({ errorMessage: 'Wrong username or password' });
        }
        if (user) {
            console.log('found user', user);
            bcrypt.compare(password, user.password, function (err, valid) {
                if (!valid) {
                    res.json({ errorMessage: 'Wrong username or password' });
                }
                console.log('pwd valid', true)
                // const token = jwt.sign(user, 'This is a secret string', { expiresIn: '1h' });
                // res.json({ token: token, username: user.name, email: user.email });
                res.json(user);
            });
        }
    });
});

userRouter.get('/byLeagueId/:leagueId', function (req, res) {
    const { leagueId } = req.params;
    User.find({ leagues: leagueId }).then(users => {
        res.json(users);
    });
});


module.exports = userRouter;