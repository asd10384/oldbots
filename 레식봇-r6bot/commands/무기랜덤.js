const { MessageEmbed } = require('discord.js');
const { prefix, deletetime } = require('./../config.json');

module.exports = {
    name: '무기랜덤',
    aliases: ['무기', '무'],
    cooldown: 0,
    description: '무기1,2,3 무작위',
    execute(message) {
        const args = message.content.split(/ /gi);
        if (args.length >= 2) {
            if (args[1] == '랜덤') {
                const r2 = Math.floor(Math.random() * 3 + 1);
                const embed = new MessageEmbed()
                    .addField(`당신의 무기`, `**${r2}**번 무기`)
                    .setColor('ORANGE')
                    .setAuthor(
                        name=`${message.author.username}`,
                        url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                        icon_url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    );
                message.channel.send(embed)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
            } else {
                message.channel.send(`${prefix}무기 랜덤`)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
            }
        } else {
            const r2 = Math.floor(Math.random() * 3 + 1);
            const embed = new MessageEmbed()
                .addField(`당신의 무기`, `**${r2}**번 무기`)
                .setColor('ORANGE')
                .setAuthor(
                    name=`${message.author.username}`,
                    url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                    icon_url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                );
            message.channel.send(embed)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
        }
    }
};