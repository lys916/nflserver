const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Schema.Types.ObjectId;

const GameSchema = new mongoose.Schema({
    roadTeam: Schema.Types.Mixed,
    homeTeam: Schema.Types.Mixed,
    roadSpread: { type: String },
    homeSpread: { type: String },
    week: { type: Number },
    winner: { type: String, default: null }
});

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;