const { MessageEmbed } = require('discord.js');
const { prefix, deletetime } = require('./../config.json');

module.exports = {
    name: '굳',
    aliases: ['굳굳', 'good'],
    cooldown: 0,
    description: 'good',
    execute(message) {
        message.reply(`굳 :thumbsup:`)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
    }
};