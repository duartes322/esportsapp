const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const TournamentSchema = new Schema({
    matches: [{type:Schema.Types.ObjectId, ref:'Match'}],
    postId: {type:Schema.Types.ObjectId, ref:'Post'},
}, {
    timestamps: true,
});

const TournamentModel = model('Tournament', TournamentSchema);

module.exports = TournamentModel;