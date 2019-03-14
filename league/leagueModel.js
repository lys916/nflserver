const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
var shortid = require('shortid-36');

const LeagueSchema = new mongoose.Schema({
    // roadTeam: Schema.Types.Mixed,
    // homeTeam: Schema.Types.Mixed,
    name: { type: String },
    pin: { type: String },
    weeks: [Schema.Types.Mixed],
    games: [{ type: ObjectId, ref: 'Game' }],
    picks: [{ type: ObjectId, ref: 'Pick' }],
    notes: { type: String },
    leagueId: { type: String, default: shortid.generate() },
    users: [{ type: ObjectId, ref: 'User' }],
    season: { type: ObjectId, ref: 'Season' },
    admin: { type: ObjectId, ref: 'User' },
    status: { type: String, default: 'open' }
});

const LeagueModel = mongoose.model('League', LeagueSchema);

module.exports = LeagueModel;