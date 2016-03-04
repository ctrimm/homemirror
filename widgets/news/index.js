/**
 * Collections.
 */

Headlines = new Mongo.Collection("headlines");

/**
 * Client.
 */

if (Meteor.isClient) {

  // When Headlines updates, send update to news template.
  Template.news.helpers({
    headlines: function() {
      return Headlines.find({});
    }
  });
  Meteor.call('newsStart');
}

/**
 * Server.
 */

if (Meteor.isServer) {

  Meteor.methods({
    newsStart: function() {
      nytimes();
      // SyncedCron.start();
    }
  });
}

// Every hour, ping nyt for new headlines.
function nytimes() {
  var apiKey = 'beabcdb1445a9d428c8e67c070b8babb:19:73127967';
  var travelUrl = 'http://api.nytimes.com/svc/topstories/v1/travel.json?api-key=';
  var travelGet = Meteor.wrapAsync(HTTP.get);
  var travelRes = travelGet(travelUrl + apiKey);
  var travelContent = JSON.parse(travelRes.content);

  // Save to Collection.
  Headlines.remove({});
  for (var i = 0; i < 5; i++) {
    Headlines.insert(travelContent.results[i]);
  }
  
  var technologyUrl = 'http://api.nytimes.com/svc/topstories/v1/technology.json?api-key=';
  var technologyGet = Meteor.wrapAsync(HTTP.get);
  var technologyRes = technologyGet(technologyUrl + apiKey);
  var technologyContent = JSON.parse(technologyRes.content);
  for (var i = 0; i < 5; i++) {
    Headlines.insert(technologyContent.results[i]);
  }
}

/**
 * Cronjob.
 */

// SyncedCron.add({
//   name: 'Get headlines',
//   schedule: function(parser) {
//     return parser.cron('0 0 0/1 1/1 * ? *');
//   },
//   job: nytimes
// });
