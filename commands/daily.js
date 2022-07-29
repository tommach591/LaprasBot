module.exports = {
    name: 'daily',
    description: "Get a daily Pokemon to draw!",

    execute(message, userid) {
        const { EmbedBuilder } = require('discord.js');
        const embedMsg = new EmbedBuilder();
        embedMsg.setColor('00FF00');
        embedMsg.setTitle('Pokemon of the Day!')
        embedMsg.setDescription("#131 Lapras");
        embedMsg.setImage("https://assets.pokemon.com/assets/cms2/img/pokedex/detail/131.png");
        message.channel.send({ embeds: [embedMsg] });
    }
}