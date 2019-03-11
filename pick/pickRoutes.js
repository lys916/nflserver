const express = require('express');
const pickRouter = express.Router();

const Pick = require('./pickModel');

pickRouter.post('/create', function (req, res) {
	console.log('creating a pick', req.body);
	Pick.create(req.body).then(pick => {
		pick.populate('user').populate('game', function (err) {
			res.json(pick);
		});
	});
});

pickRouter.post('/fetch', function (req, res) {
	// const { date, userName } = req.query;
	// console.log('get food data', req.body)
	const { league } = req.body;
	console.log('fetching picks with this league ID', league);
	Pick.find({ league }).populate('user').populate('game').then(picks => {
		res.json(picks);
	});
});

pickRouter.post('/delete', function (req, res) {
	const { id } = req.body;
	Pick.findByIdAndRemove(id).then(deleted => {
		res.json(deleted);
	});
});

pickRouter.post('/update', function (req, res) {
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