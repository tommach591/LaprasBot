module.exports = {
    name: 'daily',
    description: "Get a daily Pokemon to draw!",

    execute(message, userid, masterData) {
        const pokemon = require('pokemon');
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
            var id = Math.floor(Math.random() * 905) + 1;
            var images = [`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${zeroPad(id, 3)}.png`];

            var i = 2;
            var form = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${zeroPad(id, 3)}_f${i}.png`;
            while (imageExists(form))
            {
                images.push(form);
                i++;
                form = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${zeroPad(id, 3)}_f${i}.png`;
            }
    
            pkmnMsg.setColor('64ECFF');
            pkmnMsg.setTitle(`Pokemon of the Day! - #${id} ${pokemon.getName(id)}`);
            pkmnMsg.setImage(images[Math.floor(Math.random() * images.length)]);
            message.channel.send({ embeds: [pkmnMsg] });
        }

        if (masterData["daily"])
        {
            newDaily();
            masterData["daily"] = false;
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