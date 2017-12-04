var auth = require('./auth.json');
// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = auth.token

// constants
const jeansId = '157610741858304000';
const botId = '379491763414368261';
const jobsId = '364834807043063819';
const gamesId = '';

const generalize = true; // generalizes bot to not be only for Jeans

var jeans = null;
var jobsChannel = null;
var gamesChannel = null;

var despairRegexes = [];

// helper functions
function isJeans(user) {
    return (user.id === jeansId);
}

function isBot(user) {
    return (user.id === botId);
}

function loadDespairPhrases() {
    const despairPhrases = require('./jeans-despair.json');
    var despairRegexes = []
    for(let phrase of despairPhrases.phrases) {
        despairRegexes.push(new RegExp(phrase));
    }
    return despairRegexes;
}

function getChannels(guild, idList) {
    let channels = [];
    for(id of idList) {
        let chan = guild.channels.get(id);
        if(chan !== undefined && chan !== null) {
            channels.push(chan);
        }
    }
    return channels;
}

// main
client.on('ready', () => {
  console.log('Successfully connected.');
  despairRegexes = loadDespairPhrases();
});

// Create an event listener for messages
client.on('message', message => {
    // console.log(message.content);

    if (jobsChannel === null && message.channel.id === jobsId) {
        jobsChannel = message.channel;
    }
    if (gamesChannel === null && message.channel.id === gamesId) {
        gamesChannel = message.channel;
    }

    if ((message.content.toLowerCase() === 'fuck <@' + botId + '>') ||
        (message.content.toLowerCase() === 'fuck you <@' + botId + '>')) {
        console.log(message.author.username + ': ' + message.content);
        console.log('me: Fuck you too, <@' + message.author.id + '>!')
        message.channel.send('Fuck you too, <@' + message.author.id + '>!');
    }
    else if (isJeans(message.author) || generalize) {
        if (jeans === null) { jeans = message.author; }
        let despairFlag = false;
        for(exp of despairRegexes) {
            if(exp.test(message.content.toLowerCase())) {
                console.log(message.author.username + ': ' + message.content);
                console.log('me: Hi <@' + message.author.id + '>. I sense that you are in despair.');
                message.channel.send('Hi <@' + message.author.id + '>. I sense that you are in despair.');
                break;
            }
        }
    }
});

client.on('presenceUpdate', update => {
    if(isJeans(update.user)) {
        if (jeans === null) { jeans = update.user; }
        if (jeans.presence.game !== null) {
            console.log('me: Stop playing ' + jeans.presence.game.name + ', <@' + jeansId + '>! Apply to some <#' + jobsId + '>!');
            for (channel of [gamesChannel, jobsChannel]) {
                if (channel !== null) {
                    channel.send('Stop playing ' + jeans.presence.game.name + ', <@' + jeansId + '>! Apply to some <#' + jobsId + '>!');
                }
            }
        }
    }
})

// Log our bot in
client.login(token);
