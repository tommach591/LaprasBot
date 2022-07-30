module.exports = {
    name: 'daily',
    description: "Get a daily Pokemon to draw!",

    execute(message, userid, pokemon, dailies) {
        const pkmn = require('pokemon');
        const AWS = require("aws-sdk");
        const { EmbedBuilder } = require('discord.js');
        const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

        const zeroPad = (num, places) => String(num).padStart(places, '0');

        let imageExists = (image_url) => {
            var http = new XMLHttpRequest();
            http.open('HEAD', image_url, false);
            http.send();
            return http.status != 404;
        }

        let newDaily = () =>
        {
            const pkmnMsg = new EmbedBuilder();
            var selectedID = "";

            if (!pokemon[userid])
            {
                pokemon[userid] = [];
            }

            while (selectedID == "" || pokemon[userid].includes(selectedID))
            {
                var id = Math.floor(Math.random() * 905) + 1;
                var images = [`${zeroPad(id, 3)}`];

                var i = 2;
                var currID = `${zeroPad(id, 3)}_f${i}`;
                var form = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${currID}.png`;
                while (imageExists(form))
                {
                    images.push(currID);
                    i++;
                    currID = `${zeroPad(id, 3)}_f${i}`;
                    form = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${currID}.png`;
                }
                var selectedID = images[Math.floor(Math.random() * images.length)];
            }
    
            pkmnMsg.setColor('64ECFF');
            pkmnMsg.setTitle(`Pokemon of the Day! - #${id} ${pkmn.getName(id)}`);
            pkmnMsg.setImage(`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${selectedID}.png`);
            message.channel.send({ embeds: [pkmnMsg] });

            pokemon[userid].push(selectedID);
            pokemon[userid].sort((a, b) => a - b);

            const s3 = new AWS.S3({
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                Bucket: process.env.BUCKET
            });
            
            const pokemonParams = {
                Bucket: process.env.BUCKET,
                Key: "storage/pokemon.json"
            };

            s3.putObject({
                Bucket: process.env.BUCKET,
                Key: pokemonParams.Key,
                Body: JSON.stringify(pokemon),
                ContentType: "application/json"},
                function (err, data) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                }
            );
        }

        if (!dailies[userid])
        {
            newDaily();
            dailies[userid] = true;
        }
        else
        {
            const questionMsg = new EmbedBuilder();
            questionMsg.setTitle('Try Again?');
            questionMsg.setColor('FFF000');
            questionMsg.setDescription("You already use your daily. Try again?");

            let question; 
            message.channel.send({ embeds: [questionMsg] }).then(
                sent => { question = sent } 
            ).then(
                () => {
                    question.react('👍').then(() => question.react('👎'));
                    const filter = (reaction, user) => {
                        return ['👍', '👎'].includes(reaction.emoji.name) && user.id === userid;
                    };
                    question.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
                    .then(
                        collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '👍') {
                            newDaily();
                        } 
                        else {
                            const embedMsg = new EmbedBuilder();
                            embedMsg.setTitle('Declined!');
                            embedMsg.setColor('FF0000');
                            embedMsg.setDescription("<@" + userid + "> declined the temptation!");
                            message.channel.send({ embeds: [embedMsg] });
                        }
                    })
                    .catch(collected => {
                        const embedMsg = new EmbedBuilder();
                        embedMsg.setTitle('Fail!');
                        embedMsg.setColor('FF0000');
                        embedMsg.setDescription("<@" + userid + "> took too long to respond!");
                        message.channel.send({ embeds: [embedMsg] });
                    });
                }
            );
        }
    }
}