/**
 * Your slackbot token is available as the global variable:

process.env.SLACKBOT_TOKEN

 * When deployed to now.sh, the URL of your application is available as the
 * global variable:

process.env.NOW_URL

 * The URL is useful for advanced use cases such as setting up an Outgoing
 * webhook:
 * https://github.com/howdyai/botkit/blob/master/readme-slack.md#outgoing-webhooks-and-slash-commands
 *
 */

var Botkit = require('botkit');
var controller = Botkit.slackbot({
  json_file_store: '/tmp/slack_storage.json'
});
var bot = controller.spawn({
  token: process.env.SLACKBOT_TOKEN
})
var my_users = null;
bot.startRTM(function(error, whichBot, payload) {
  if (error) {
    throw new Error('Could not connect to Slack');
  } else {
    console.log("Connected to Slack yo");
    controller.storage.users.all(
      function(err, all_user_data) {
         if(err){
           console.log("Error fetching users...");
         } else {
           console.log("Found " + all_user_data.length + " users.");
           console.log(all_user_data);
           my_users = all_user_data;
         }
      }
    );
  }
});

controller.hears(
  ['yo diddy'],
  ['direct_message', 'direct_mention', 'mention', 'ambient'],
  function(whichBot, message) {
      whichBot.reply(message, 'Hi Nick');
  }
);
/* Assumed there was an array */

controller.hears(
  ['who dere?'],
  ['direct_message', 'direct_mention', 'mention','ambient'],
  function(whichBot, message) {
      whichBot.reply(message, "I have " + my_users.length + ' users, cool?');
      controller.storage.users.all(
        function(err, all_user_data) {
           if(err){
             console.log("Error fetching users...");
           } else {
             console.log("Found " + all_user_data.length + " users.");
             console.log(all_user_data);
             my_users = all_user_data;
           }
        }
      );
  }
);

controller.hears(
  ['pizzatime'],
  ['ambient', 'direct_message'],
  function(bot,message) {
    bot.startConversation(message, askFlavor);
  }
);

  askFlavor = function(err, convo) {
    convo.ask(
      "What flavor of pizza do you want?",
      function(response, convo) {
        convo.say("Awesome.");
        askSize(response, convo);
        convo.next();
      }
    );
  };

  askSize = function(response, convo) {
    convo.ask(
      "What size do you want?",
      function(response, convo) {
        convo.say("Ok - you want: " + response.text);
        if(response.text === "small") {
          convo.say("Sorry, we don't do smalls bro.")
          convo.next();
        } else if (response.text === "large") {
            convo.say("Sounds good!");
            askWhereDeliver(response, convo);
            convo.next();
          }
          else {
            convo.say("Comeon - get a large, mate!");
            askSize(response, convo);
            convo.next();
          }
      }
    );
  }
  askWhereDeliver = function(response, convo) {
    convo.ask(
      "So where do you want it delivered?",
      function(response, convo) {
        convo.say("Ok! Goodbye.");
        convo.next();
      }
    );
  }
