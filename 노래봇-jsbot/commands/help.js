const fs = require('fs');

module.exports = {
    name: 'help',
    description: '도움말을 보여줍니다.',
    usage: '/help',
    execute(message) {
        let str = '';
        const commandFiles = fs
            .readdirSync('./commands')
            .filter((file) => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            str += '```도움말\n\n';
            str += ` - ${command.name} : ${command.description}\n  (사용법 : ${command.usage}) \n`;
            str += '```';
        }

        message.channel.send(str);
    },
};