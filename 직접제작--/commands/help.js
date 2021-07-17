const { MessageEmbed } = require('discord.js');
const { botname } = require('./../config.json');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: '명령어 확인',
    execute(message) {
        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setAuthor(`\`**${botname}**\``)
            .setTitle('봇 명령어')
            .setDescription('명령어 (같은 명령어)')
            .setColor('#F8AA2A')

        commands.forEach((cmd) => {
            helpEmbed.addField(
                `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}`,
                `${cmd.description}`, true
            );
        });

        helpEmbed.setTimestamp();

        return message.channel.send(helpEmbed)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, 5000)
            });
    }
};