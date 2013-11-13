// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click #ordenar': function () {
      Session.set("orden",Session.get("orden") ? false : true);
    },
    'click input.random': function () {

	Players.find().forEach(function(jugador){
		console.log(jugador);
		Players.update(jugador._id,{$set: {score: Math.floor(Random.fraction()*10)*5}});	
	});
    }

  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }

  });
  Template.nuevo.events({
    'click input.new': function () {
      Players.insert({name: Nombre.value, score: Math.floor(Math.random()*10)*5});
    }
  });
  Template.leaderboard.players = function () {
    var ordenar = Session.get("orden") ?
    {name: 1, score: -1} :
    {score: -1, name: 1};
    return Players.find({}, {sort: ordenar});
    };
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
	
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }

  });
}
