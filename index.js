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
var dailies = JSON.parse("{}");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    Bucket: process.env.BUCKET
});

const pokemonParams = {
    Bucket: process.env.BUCKET,
    Key: "storage/pokemon.json"
};

async function getObject(params) {
    try {  
      const data = await s3.getObject(params).promise();
      return data.Body.toString('utf8');
    } 
    catch (e) {
      throw new Error(`Could not retrieve file from s3: ${e.message}`)
    }
}

let pokemonPromise;
getObject(pokemonParams).then(
    function(result) {
        pokemonPromise = result;
    },
    function(err) {
        console.log(err);
    }
)

var pokemon = "";

client.once('ready', () => {
    console.log("LaprasBot is online!");
});

client.on('messageCreate', message => { 
    if (pokemon == "") {
        if (pokemonPromise) 
            pokemon = JSON.parse(pokemonPromise);
        else 
            return;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    var sender = message.author;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'daily':
            client.commands.get('daily').execute(message, sender.id, pokemon, dailies);
            break;
        default:
            break;
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason);
});

client.login(process.env.DISCORD_TOKEN); // Last Line in File