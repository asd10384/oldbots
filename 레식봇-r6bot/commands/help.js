const { MessageEmbed } = require('discord.js');
const { deletetime } = require('./../config.json');

module.exports = {
    name: 'help',
    aliases: ['h', '도움말', '명령어'],
    cooldown: 0,
    description: '명령어 확인',
    execute(message) {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle('봇 명령어')
            .setDescription('명령어 (같은 명령어)')
            .setColor('#F8AA2A');

        commands.forEach((cmd) => {
            helpEmbed.addField(
                `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}`,
                `${cmd.description}`, true
            );
        });
        message.channel.send(helpEmbed)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime + (deletetime / 2))
            });
    }
};