var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var google = require('google');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

let TRIGGER_PHRASE = "hey nexus";
let COMMANDS = [
    {str: "search for", type: 'search'},
    {str: "google", type: 'search'},
    {str: "what is", type: 'search'}
];

function commandSplit(message) {
    if (message.indexOf(TRIGGER_PHRASE) === 0) {
        let command = "";
        let type = undefined;
        message = message.substring(TRIGGER_PHRASE.length).trim();
        for (let i = 0; i < COMMANDS.length; i++) {
            if (message.indexOf(COMMANDS[i].str) === 0) {
                command = COMMANDS[i].str;
                type = COMMANDS[i].type;
                message = message.substring(COMMANDS[i].length).trim();
                break;
            }
        }
        return {command: command, type: type, message: message};
    }
    return {command: undefined, type: undefined, message: message};
}

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
         }
    } else {
        message = message.replace(/[.,\/#!$@%?\^&\*;:{}=\-_`~()]/g,"")
        let command = commandSplit(message);
        console.log("Message: ", message);
        console.log("Command: ", command);
        if (command.command) {
            if (command.command === '') {
                bot.sendMessage({to: channelID, message: "Hey " + user + "!"});
            } else {
                message = message.substring(TRIGGER_PHRASE.length).trim();
                if (command.type === 'search') {
                    bot.sendMessage({to: channelID, message: "Sure, gimme one sec."});
                    var searchTerm = command.message;
                    google.resultsPerPage = 1;
                    google(searchTerm, (err, res) => {
                        if (err) {
                            console.log(err);
                            bot.sendMessage({to: channelID, message: "I'm sorry, I encountered an error when searching for '" + searchTerm + "'."});
                        } else {
                            if (res.links.length === 0) {
                                bot.sendMessage({to: channelID, message: "I was unable to find any results for '" + searchTerm + "'"});
                            } else {
                                console.log("Google results: ", res.links);
                                var link = res.links[0];
                                if (link.href === null && res.links.length > 1) {
                                    link = res.links[1];
                                }
                                bot.sendMessage({to: channelID, message: "The top result is:\n" + link.href + "\n"})
                            }
                        }
                    });
                }
            }
        }
    }
});

