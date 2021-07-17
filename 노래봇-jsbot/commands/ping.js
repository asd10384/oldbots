const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'ping',
    description: 'say pong',
    usage: '/ping',
    execute(message) {
        const commandFiles = fs
            .readdirSync('./commands')
            .filter((file) => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(`./${file}`);
        }
        message.channel.send('핑 확인중...').then(m => {
            var pping = m.createdTimestamp - message.createdTimestamp;

            var pingembed = new Discord.MessageEmbed()
                .setAuthor(`퐁! ${pping}ms`)
                .setColor(15844367)
            m.edit(pingembed);
        });
    },
};