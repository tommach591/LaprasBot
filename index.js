const Discord = require("discord.js");

const AWS = require("aws-sdk");

const { MessageEmbed } = require('discord.js');
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMessageReactions] }); 

const prefix = '!iv ';

const fs = require('fs');
const { send } = require("process");

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
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
        default:
            client.commands.get('daily').execute(message);
            break;
    }
});

client.login(process.env.DISCORD_TOKEN); // Last Line in File