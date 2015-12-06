console.log("Hello World");

FlavoursList = new Mongo.Collection('flavours');
VotesList = new Mongo.Collection('votes');

if(Meteor.isClient){
  Session.set('message', "Choose a flavour!");
  Session.set('selectedWeather',"weather");
  Session.set('weatherData',"click here...");

  Template.leaderboard.helpers({
  'flavour': function(){
        return FlavoursList.find({}, {sort: {votes: -1} });
  },
  'selectedClass': function(){
    var flavourId = this._id
    var selectedFlavour = Session.get('selectedFlavour');
    if(flavourId == selectedFlavour){
      return "selected";
    }
  },
      'message': function(){
          return Session.get('message');
   },
    'curweather': function(){
       return Session.get("weatherData");
     }
});

Template.leaderboard.events({
'click .flavour': function(){
    VotesList.insert({ user: Meteor.userId(), flavour: 'blank', timestamp: 0});
    var date = new Date();
    var now = date.getTime();
    var dayMilli = 10000; // 86400000
    var elapsedSinceVote = now - (VotesList.findOne({user: Meteor.userId()}, {sort: {timestamp: -1}}).timestamp);
    if(elapsedSinceVote > dayMilli){
      console.log("Flavour added");
      var flavourId = this._id;
      Session.set('selectedFlavour', flavourId);
      var selectedFlavour = Session.get('selectedFlavour');
      FlavoursList.update(selectedFlavour, {$inc: {votes: 1} });
      Session.set('message', "You chose: "+FlavoursList.findOne(selectedFlavour, {fields: {name: 1}}).name);
      VotesList.insert({ user: Meteor.userId(), flavour: FlavoursList.findOne(selectedFlavour, {fields: {name: 1}}).name, timestamp: now});
      };
    },
  'click .weather': function(){
    if(Session.get('selectedWeather') == "weather"){
      Session.set('selectedWeather', "temperature")
      var weatherinfo = "temperature";
      var result = Meteor.call('getWeather',weatherinfo,function(err,results){
        Session.set("weatherData", results);
      })
    }
    else if(Session.get('selectedWeather') == "temperature"){
      Session.set('selectedWeather', "weather")
      var weatherinfo = "weather";
      var result = Meteor.call('getWeather',weatherinfo,function(err,results){
        Session.set("weatherData", results);
      })
    }
    console.log(Session.get('selectedWeather'))
  }
  });
}


if(Meteor.isServer){
    Meteor.methods({
  'getWeather':function(weatherinfo){
    var xmlData = Meteor.http.call('GET', 'http://api.openweathermap.org/data/2.5/weather?q=Melbourne,AU&mode=xml&units=metric&appid=b92e5a78cab7d8c1feb6647082f4cd24');
    var temp =  xml2js.parseStringSync(xmlData.content);
    if (weatherinfo === "weather"){
      return temp.current.weather[0]['$'].value+". (click to change)";
    }else{
      return temp.current.temperature[0]['$'].value+" degrees. (click to change)";
    }
   }
  })
}