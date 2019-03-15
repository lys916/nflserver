const express = require('express');
const User = require('./UserModel.js');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

userRouter.post('/signup', function (req, res) {
    console.log('api signing up a user');
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
    console.log('api logging in a user');
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

userRouter.post('/invite', function (req, res) {
    console.log('api inviting users');
    const { leagueName, leaguePin, leagueId, leagueNotes, startWeek, endWeek } = req.body.league;
    const { userName, email } = req.body.user;
    const { inviteEmails } = req.body.emails;
    ///////////////////////////////////////////////////////////////////////
    "use strict";
    const nodemailer = require("nodemailer");

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let account = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'lysaephan@gmail.com',
                pass: 'Lantern1'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Super Pickem NFL" <no-reply>@superpickem.com', // sender address
            to: req.body.emails, // list of receivers
            subject: "You've been invited to play Super Pickem NFL", // Subject line
            // text: "Hello world?", // plain text body
            html: `
            <b>Hello, you've been invited by ${req.body.user.name} to play Super Pickem. Below is the league details. You will need the league ID and PIN to join.<br/>
            <br/>
            League name: ${leagueName}<br/>
            League ID: ${leagueId}<br/>
            League PIN: ${leaguePin}<br/>
            Start week: ${startWeek}<br/>
            End week: ${endWeek}<br/>
            League rules & notes: <br/>
            ${leagueNotes}<br/>
            <br/>
            Don't have the Super Pickem app? Download it for free at:<br/>
            Google play www.google.com/playsotre<br/>
            Apple Store www.apple.com/store</b>` // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions)
        res.json({ sent: true });
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
    ////////////////////////////////////////////////////////////////////////

});

userRouter.get('/byLeagueId/:leagueId', function (req, res) {
    console.log('api getting a user with id ', req.params);

    const { leagueId } = req.params;
    User.find({ leagues: leagueId }).then(users => {
        res.json(users);
    });
});


module.exports = userRouter;