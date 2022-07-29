module.exports = {
    name: 'daily',
    description: "Get a daily Pokemon to draw!",

    execute(message, userid) {
        const { EmbedBuilder } = require('discord.js');
        const embedMsg = new EmbedBuilder();
        embedMsg.setColor('00FF00');
        embedMsg.setDescription("Working!");
        console.log("Working!");
        message.channel.send({ embeds: [embedMsg] });
    }
}