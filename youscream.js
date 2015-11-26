console.log("Hello World");

FlavoursList = new Mongo.Collection('flavours');

if(Meteor.isClient){
Template.leaderboard.helpers({
  'flavour': function(){
        return FlavoursList.find();
  },
      'selectedClass': function(){
    var flavourId = this._id
    var selectedFlavour = Session.get('selectedFlavour');
    if(flavourId == selectedFlavour){
      return "selected";
    }
  }
});

Template.leaderboard.events({
  'click .flavour': function(){
    var flavourId = this._id;
    Session.set('selectedFlavour', flavourId);
    var selectedFlavour = Session.get('selectedFlavour');
    console.log(selectedFlavour);
  }
});

}

if(Meteor.isServer){

}