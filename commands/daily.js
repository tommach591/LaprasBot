module.exports = {
    name: 'daily',
    description: "Get a daily Pokemon to draw!",

    execute(message, userid) {
        const pokemon = require('pokemon');
        const { EmbedBuilder } = require('discord.js');
        
        const embedMsg = new EmbedBuilder();

        const zeroPad = (num, places) => String(num).padStart(places, '0');
        
        var id = Math.floor(Math.random() * 905) + 1;
        var image = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${zeroPad(id, 3)}.png`;

        embedMsg.setColor('FFF000');
        embedMsg.setTitle('Pokemon of the Day!');
        embedMsg.setDescription(`#${id} ${pokemon.getName(id)}`);
        embedMsg.setImage(image);
        message.channel.send({ embeds: [embedMsg] });
    }
}