module.exports = {
    name: 'daily',
    description: "Get a daily Pokemon to draw!",

    execute(message, userid) {
        const { EmbedBuilder } = require('discord.js');
        const embedMsg = new EmbedBuilder();

        const zeroPad = (num, places) => String(num).padStart(places, '0');
        var pokedexEntry = zeroPad(getRandomInt(905) + 1, 3);
        var image = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokedexEntry}.png`;
        embedMsg.setColor('FFF000');
        embedMsg.setTitle('Pokemon of the Day!');
        embedMsg.setImage(image);
        message.channel.send({ embeds: [embedMsg] });
    }
}