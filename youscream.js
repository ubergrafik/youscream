console.log("Hello World");

FlavoursList = new Mongo.Collection('flavours');

if(Meteor.isClient){
  
Session.set('message', "Choose a flavour!");

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
      }

});

Template.leaderboard.events({
  'click .flavour': function(){
    var flavourId = this._id;
    Session.set('selectedFlavour', flavourId);
    var selectedFlavour = Session.get('selectedFlavour');
    FlavoursList.update(selectedFlavour, {$inc: {votes: 1} });
    Session.set('message', "You chose: "+FlavoursList.findOne(selectedFlavour, {fields: {name: 1}}).name)
  }
});
}


if(Meteor.isServer){

}