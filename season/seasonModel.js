const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = mongoose.Schema.Types.ObjectId;

const SeasonSchema = new mongoose.Schema({
    // year: Schema.Types.Mixed,
    // homeTeam: Schema.Types.Mixed,
    year: { type: String, default: '2019' },
    availableWeeks: [Schema.Types.Mixed],
    currentWeek: Schema.Types.Mixed,
    startDate: { type: Date },
    active: { type: Boolean }
    // winner: { type: String, default: null }
});

const SeasonModel = mongoose.model('Season', SeasonSchema);

module.exports = SeasonModel;