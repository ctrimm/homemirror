/**
 * Client.
 */

if (Meteor.isClient) {

  /**
   * Return date.
   */

  Template.date.helpers({
    date: function() {
      return Chronos.liveMoment().format("dddd, mmmm Do");
    }
  });
}
