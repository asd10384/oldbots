const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

module.exports = {
    name: 'em',
    description: 'make embed',
    usage: '/em color title text',
    execute(message) {
        const commandFiles = fs
            .readdirSync('./commands')
            .filter((file) => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(`./${file}`);
        }

        const colorcode = {
            AQUA: 1752220,
            GREEN: 3066993,
            BLUE: 3447003,
            PURPLE: 10181046,
            GOLD: 15844367,
            ORANGE: 15105570,
            RED: 15158332,
            GREY: 9807270,
            DARKER_GREY: 8359053,
            NAVY: 3426654,
            DARK_AQUA: 1146986,
            DARK_GREEN: 2067276,
            DARK_BLUE: 2123412,
            DARK_PURPLE: 7419530,
            DARK_GOLD: 12745742,
            DARK_ORANGE: 11027200,
            DARK_RED: 10038562,
            DARK_GREY: 9936031,
            LIGHT_GREY: 12370112,
            DARK_NAVY: 2899536,
            LUMINOUS_VIVID_PINK: 16580705,
            DARK_VIVID_PINK: 12320855
        };
        const colorstr = `
            AQUA: 1752220
            GREEN: 3066993
            BLUE: 3447003
            PURPLE: 10181046
            GOLD: 15844367
            ORANGE: 15105570
            RED: 15158332
            GREY: 9807270
            DARKER_GREY: 8359053
            NAVY: 3426654
            DARK_AQUA: 1146986
            DARK_GREEN: 2067276
            DARK_BLUE: 2123412
            DARK_PURPLE: 7419530
            DARK_GOLD: 12745742
            DARK_ORANGE: 11027200
            DARK_RED: 10038562
            DARK_GREY: 9936031
            LIGHT_GREY: 12370112
            DARK_NAVY: 2899536
            LUMINOUS_VIVID_PINK: 16580705
            DARK_VIVID_PINK: 12320855
        `;

        const botname = `노래봇`;
        const str = message.toString();
        const cut = str.split(' ');
        
        if (cut[1] == 'color') {
            var colorembed = new Discord.MessageEmbed()
                    .setAuthor(`${botname}님의 임배드`)
                    .setTitle('디스코드 색깔확인')
                    .setDescription(colorstr)
                message.channel.send(colorembed);
        }
        else if (cut.length >= 3) {
            const setcolor = cut[1].toString().toUpperCase();
            const getcolor = colorcode[setcolor];
            const settext = cut.slice(3).join(' ');
            
            var emembed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}님의 임배드`)
                    .setColor(getcolor)
                    .setTitle(cut[2])
                    .setDescription(settext)
                message.channel.send(emembed);
        }
        else {
            var helpembed = new Discord.MessageEmbed()
                    .setAuthor(`${botname}님의 임배드`)
                    .setTitle('명령어 확인')
                    .setDescription('사용법 : /em color title text\n색깔확인 : /em color')
                message.channel.send(helpembed);
        }
    },
};