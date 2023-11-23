const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const MatchSchema = new Schema({
	id: String,
	tournamentId: String,
	name: String,
	nextMatchId: String,
	tournamentRoundText: String,
	startTime: String,
	state: String,
	participants: [{type:Schema.Types.ObjectId, ref: 'Player'}],
}, {
	timestamps: true,
});

const MatchModel = model('Match', MatchSchema);

module.exports = MatchModel;