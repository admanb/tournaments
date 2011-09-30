_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var Tournament, Tournaments, Player, Players, TournamentRow, TournamentList, TournamentForm,
		PlayerRow, PlayerList, PlayerForm, AppView;

Tournament = Backbone.Model.extend({
	
	Collection: Tournaments,
	
	url: /tournaments.json/
	
});

Tournaments = Backbone.Collection.extend({
	
	url: '/tournaments.json',
	model: Tournament
	
});

var Tournaments = new Tournaments();

Player = Backbone.Model.extend({
	
	Collection: Players,
	
	url: '/players.json/'
	
});

Players = Backbone.Collection.extend({
	
	url: '/players.json',
	model: Player
	
});

var Players = new Players();

Participant = Backbone.Model.extend({
	
	Collection: Participants,
	
	url: '/participants.json'
	
});

Participants = Backbone.Collection.extend({

	url: '/participants.json',
	model: Participant
	
});

var Participants = new Participants();

TournamentView = Backbone.View.extend({
	el: $('#tournament-view'),
	
	initialize: function() {
    _.bindAll(this, 'render');
		this.selectedTournament = null;
	},
	
	render: function(tournament) {
		this.el.find('#title').html(tournament.get('title'));
		this.el.find('#description').html(tournament.get('description'));
		this.el.show();
		this.selectedTournament = tournament;
	}
})

TournamentRow = Backbone.View.extend({
	tagName: 'li',
	
	events: {
		'click a': 'selectTournament'
	},
	
	template: _.template($('#tournament-row-template').html()),
	
	initialize: function() {
		_.bindAll(this, 'render', 'selectTournament');
	},
	
	selectTournament: function() {
		appView.tournamentList.remove();
		appView.tournamentForm.remove();
		appView.tournamentView.render(this.model);
	},
	
	render: function() {
		$(this.el).html(this.template({
			id: this.model.id,
			title: this.model.get('title')
		}))
		return this;
	}
});

TournamentList = Backbone.View.extend({
	el: $('#tournament-info'),
	
	events: {	
	},
	
	initialize: function() {
    _.bindAll(this, 'render', 'addTournament', 'selectTournament');
    this.collection.bind('reset', this.render);
	},
	
	addTournament: function(t) {
    var index = Tournaments.indexOf(t) + 1;
    t.rowView = new TournamentRow({ model: t });
    var el = this.el.find('li:nth-child(' + index + ')');
    if (el.length) {
      el.after(t.rowView.render().el);
    } else {
      this.el.append(t.rowView.render().el);
    }
  },

	selectTournament: function(t) {
		//stub
	},

	create: function(title, description) {
		var t = new Tournament({ title: title, description: description })
    
    t.save();
		Tournaments.add(t);
    this.addTournament(t);
  },

  render: function(tournaments) {
    var tournamentList = this;
    tournaments.each(function(t) {
      tournamentList.addTournament(t);
    });
  }
});

TournamentForm = Backbone.View.extend({
	el: $('#tournament-form'),
	
	events: {
		'click #tournament-save-button': 'save'
	},
	
	initialize: function(model) {
    _.bindAll(this, 'save', 'clearForm');
  },

  save: function(e) {
    e.preventDefault();

    var title = this.el.find('input.title').val(),
        description = this.el.find('textarea.description').val();

		this.clearForm();
    appView.tournamentList.create(title, description);
  },

	clearForm: function() {
		this.el.find('input.title').val('');
		this.el.find('textarea.description').val('');
	}
});


PlayerRow = Backbone.View.extend({
	tagName: 'li',
	
	events: { 
		'click a': 'selectPlayer' 
	},
	
	template: _.template($('#player-row-template').html()),
	
	initialize: function() {
    _.bindAll(this, 'render', 'selectPlayer');
  },

	selectPlayer: function() {
		appView.playerList.selectPlayer(this);
	},
	
  render: function() {
    $(this.el).html(this.template({
      id: this.model.id,
      first: this.model.get('first'),
			last: this.model.get('last')
    }));
    return this;
  }
});

PlayerList = Backbone.View.extend({
	el: $('#player-list'),

  events: {
  },

  initialize: function() {
    _.bindAll(this, 'render', 'addPlayer', 'selectPlayer');
    this.collection.bind('reset', this.render);
		this.selectedPlayer = null;
  },

  addPlayer: function(p) {
    var index = Players.indexOf(p) + 1;
    p.rowView = new PlayerRow({ model: p });
    var el = this.el.find('li:nth-child(' + index + ')');
    if (el.length) {
      el.after(p.rowView.render().el);
    } else {
      this.el.append(p.rowView.render().el);
    }
  },

	selectPlayer: function(p) {
		var t = appView.tournamentView.selectedTournament;
		if(t != null) {
			var participant = new Participant({ player: p.id, tournament: t.id })
			
			participant.save();
			Participants.add(participant);
			appView.tournamentView.addParticipant(participant);
		}
	},

	create: function(first, last) {
		var p = new Player({ first: first, last: last })
    
    p.save();
		Players.add(p);
    this.addPlayer(p);
  },

  render: function(players) {
    var playerList = this;
    players.each(function(p) {
      playerList.addPlayer(p);
    });
  }
});

PlayerForm = Backbone.View.extend({
	el: $('#player-form'),
	
	events: {
		'click #player-save-button': 'save'
	},
	
	initialize: function(model) {
    _.bindAll(this, 'save', 'clearForm');
  },

  save: function(e) {
    e.preventDefault();

    var first = this.el.find('input.first').val(),
        last = this.el.find('input.last').val();

		this.clearForm();
    appView.playerList.create(first, last);
  },

	clearForm: function() {
		this.el.find('input.first').val('');
		this.el.find('input.last').val('');
	}
});

AppView = Backbone.View.extend({
  initialize: function() {
    this.playerList = new PlayerList({ collection: Players });
		this.playerForm = new PlayerForm();
		this.tournamentList = new TournamentList({ collection: Tournaments });
		this.tournamentForm = new TournamentForm();
		this.tournamentView = new TournamentView();
  }
});

var appView = new AppView();
window.Players = Players;
window.Tournaments = Tournaments;
window.appView = appView;