const express = require('express');
const pickRouter = express.Router();

const Pick = require('./pickModel');
const League = require('../league/leagueModel');

pickRouter.post('/fetch', function (req, res) {
	console.log('api fetching picks');
	// const { date, userName } = req.query;
	// console.log('get food data', req.body)
	const { league } = req.body;
	console.log('fetching picks with this league ID', league);
	Pick.find({ league }).populate('user').populate('game').then(picks => {
		res.json(picks);
	});
});

pickRouter.post('/create', function (req, res) {
	console.log('api creating a pick');
	Pick.create(req.body).then(pick => {
		League.findById(pick.league).then(league => {
			league.picks.push(pick._id);
			league.save().then(updated => {
				pick.populate('user').populate('game', function (err) {
					res.json(pick);
				});
			});
		});

	});
});



pickRouter.post('/delete', function (req, res) {
	console.log('api deleting a pick');
	const { id } = req.body;
	Pick.findByIdAndRemove(id).then(deleted => {
		League.findByIdAndUpdate(deleted.league,
			{ $pull: { picks: deleted._id } }, function (err, doc) {
				if (err) {
					console.log(err);
				} else {
					res.json(deleted);
				}
			}
		);
	});
});

pickRouter.post('/update', function (req, res) {
	console.log('api updating a pick');
	const { id } = req.body;
	Pick.findById(id).then(pick => {
		pick.selected = pick.selected === 'home' ? 'road' : 'home';
		pick.save().then(updated => {
			updated.populate('game').populate('user', function (err) {
				res.json(updated);
			});
		});

	});
});

module.exports = pickRouter;