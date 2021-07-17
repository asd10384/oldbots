const { MessageEmbed } = require('discord.js');
const { deletetime } = require('./../config.json');

module.exports = {
    name: 'ping',
    aliases: ['핑'],
    cooldown: 0,
    description: '핑 확인',
    execute(message) {
        const embed = new MessageEmbed()
            .setColor('ORANGE');
        message.channel.send(`ping?`)
            .then(m => {
                var ping = m.createdTimestamp - message.createdTimestamp;
                embed.setTitle(`PONG! ${ping}ms`);
                m.edit(embed);
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
    }
};