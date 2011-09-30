var mongoose = require('mongoose');
var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;


var Player = new Schema({
	first     : String, 
	last      : String, 
	date      : Date
});

var Tournament = new Schema({
	title				: String,
	description	: String,
	date				: Date
})

var Participant = new Schema({
	player			: ObjectId,
	tournament 	: ObjectId
})

/**
var Game = new Schema({
	firstPlayer		: ObjectId,
	secondPlayer	: ObjectId		
})**/

var Player = mongoose.model('Player', Player);
var Tournament = mongoose.model('Tournament', Tournament);
var Participant = mongoose.model('Participant', Participant);
exports.Player = Player;
exports.Tournament = Tournament;
exports.Participant = Participant;