
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var models = require('./models');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.set('db-uri', 'mongodb://localhost/tournament-development');
  app.use(express.errorHandler({ dumpExceptions: true }));
});

app.configure('production', function() {
  app.set('db-uri', 'mongodb://localhost/tournament-production');
});

var Player = models.Player;
var Tournament = models.Tournament;
var Participant = models.Participant;
var db = mongoose.connect(app.set('db-uri'));

// Routes

app.get('/', function(req, res){
	Player.find(function(err, players) {
    players = players.map(function(p) {
      return { first: p.first, last: p.last, id: p._id };
    });
		Tournament.find(function(err, tournaments) {
			tournaments = tournaments.map(function(t) {
	      return { title: t.title, description: t.description, id: t._id };
	    });
			res.render('index.jade', {
	      locals: { players: players, tournaments: tournaments }
	    });
		})
  });
});

app.get('/players.json', function(req, res){
	Player.find(function(err, players){
		res.send(players.map(function(p) {
			return { first: p.first, last: p.last, id: p._id };
	  }));
	});
});

app.post('/players.json', function(req, res){
	var p = new Player(req.body);
	p.save(function() {
		var data = p.toObject();
    data.id = data._id;
    res.send(data);
	});
});

app.post('/tournaments.json', function(req, res){
	var t = new Tournament(req.body);
	t.save(function() {
		var data = t.toObject();
		data.id = data._id;
		res.send(data);
	})
});

app.get('/participants.json'), function(req, res){
	
}

app.post('/participants.json', function(req, res){
	var p = new Participant(req.body);
	p.save(function() {
		var data = p.toObject();
		data.id = data._id;
		res.send(data);
	})
});

app.listen(3999);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
