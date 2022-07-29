const Discord = require("discord.js");
const AWS = require("aws-sdk");

const client = new Discord.Client({ 
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent, 
        Discord.GatewayIntentBits.GuildMessageReactions
    ] 
}); 

const prefix = '!pk ';
const fs = require('fs');
var masterData = JSON.parse("{}");
masterData["daily"] = true;

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log("LaprasBot is online!");
});

client.on('messageCreate', message => { 
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    var sender = message.author;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'daily':
            client.commands.get('daily').execute(message, sender.id, masterData);
            break;
        default:
            break;
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason);
});

client.login(process.env.DISCORD_TOKEN); // Last Line in File