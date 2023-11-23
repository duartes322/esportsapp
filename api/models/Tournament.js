const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const TournamentSchema = new Schema({
    matches: [{type:Schema.Types.ObjectId, ref:'Match'}],
}, {
    timestamps: true,
});

const TournamentModel = model('Tournament', TournamentSchema);

module.exports = TournamentModel;