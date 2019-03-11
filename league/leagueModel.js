const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
var shortid = require('shortid-36');

const LeagueSchema = new mongoose.Schema({
    // roadTeam: Schema.Types.Mixed,
    // homeTeam: Schema.Types.Mixed,
    name: { type: String },
    pin: { type: String },
    startWeek: { type: String },
    endWeek: { type: String },
    notes: { type: String },
    leagueId: { type: String, default: shortid.generate() },
    users: [{ type: ObjectId, ref: 'User' }],
    admin: { type: ObjectId, ref: 'User' }
});

const LeagueModel = mongoose.model('League', LeagueSchema);

module.exports = LeagueModel;