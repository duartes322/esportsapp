const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PlayerSchema = new Schema({
	id: String,
	tournamentId: String,
	resultText: String,
	isWinner: Boolean,
	status: String,
	name: String,
},{
	timestamps: true,
});

const PlayerModel = model('Player', PlayerSchema);

module.exports = PlayerModel;