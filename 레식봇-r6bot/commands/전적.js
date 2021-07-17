const { MessageEmbed } = require('discord.js');
const { deletetime } = require('./../config.json');


module.exports = {
    name: '전적',
    aliases: ['레식'],
    cooldown: 0,
    description: '레식 전적 확인',
    execute(message) {
        const args = message.contest.split(/ /gi);
        if (args.length >= 2) {
            const s = args.slice(1).join(' ');

        }
    }
};