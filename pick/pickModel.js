const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PickSchema = new mongoose.Schema({
    game: { type: ObjectId, ref: 'Game' },
    selected: { type: String },
    user: { type: ObjectId, ref: 'User' },
    league: { type: ObjectId, ref: 'League' }
});

const PickModel = mongoose.model('Pick', PickSchema);

module.exports = PickModel;