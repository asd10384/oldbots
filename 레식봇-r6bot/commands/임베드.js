const { MessageEmbed } = require('discord.js');
const { prefix, deletetime } = require('./../config.json');

module.exports = {
    name: '임베드',
    aliases: ['embed'],
    cooldown: 0,
    description: '임베드 만들기',
    execute(message) {
        const color = {
            "기본": "DEFAULT",
            "흰색": "WHITE",
            "하늘색": "AQUA",
            "초록색": "GREEN",
            "파란색": "BLUE",
            "노란색": "YELLOW",
            "보라색": "PURPLE",
            "밝은분홍색": "LUMINOUS_VIVID_PINK",
            "금색": "GOLD",
            "주황색": "ORANGE",
            "빨간색": "RED",
            "회색": "GREY",
            "어두운회색": "DARKER_GREY",
            "남색": "NAVY",
            "어두운하늘색": "DARK_AQUA",
            "어두운초록색": "DARK_GREEN",
            "어두운파란색": "DARK_BLUE",
            "어두운보라색": "DARK_PURPLE",
            "어두운분홍색": "DARK_VIVID_PINK",
            "어두운금색": "DARK_GOLD",
            "어두운주황색": "DARK_ORANGE",
            "어두운빨간색": "DARK_RED",
            "어두운회색": "DARK_GREY",
            "밝은회색": "LIGHT_GREY",
            "어두운남색": "DARK_NAVY",
            "랜덤": "RANDOM",
        };

        const colorkey = Object.keys(color);
        const colorvalue = Object.values(color);

        const args = message.content.split(/ /gi);
        if (args.length >= 2) {
            if (args.length >= 3) {
                if (args.length >= 4) {
                    const dis = args.slice(3).join(' ');
                    if (args[1] in colorkey) {
                        const embed4 = new MessageEmbed()
                            .setAuthor(
                                name=`제작자 : ${message.author.username}`,
                                url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                                icon_url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                            )
                            .setColor(color[args[1]])
                            .setTitle(args[2])
                            .setDescription(dis);
                        message.channel.send(embed4);
                    } else {
                        const embed4 = new MessageEmbed()
                            .setAuthor(
                                name=`제작자 : ${message.author.username}`,
                                url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                                icon_url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                            )
                            .setColor(args[1])
                            .setTitle(args[2])
                            .setDescription(dis);
                        message.channel.send(embed4);
                    }
                } else {
                    const embed3 = new MessageEmbed()
                        .setAuthor(
                            name=`제작자 : ${message.author.username}`,
                            url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                            icon_url=`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                        )
                        .setColor(color[args[1]])
                        .setTitle(args[2]);
                    message.channel.send(embed3);
                }
            } else if (args[1] == 'color' || args[1] == '색깔') {
                var co = '색깔코드 - ffffff 가능';
                for (var i = 0; i < colorkey.length; i++) {
                    co += `${colorkey[i]} - ${colorvalue[i]}\n`
                }
                const colorembed = new MessageEmbed()
                    .setColor(color.랜덤)
                    .setTitle('색깔들')
                    .setDescription(co)
                    .setFooter('이 임베드색깔은 랜덤 입니다.');
                message.channel.send(colorembed)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, 20000)
                    });
            }
        } else {
            const helpembed = new MessageEmbed()
                .setColor(color.랜덤)
                .setFooter('이 임베드색깔은 랜덤 입니다.')
                .setDescription('임베드 명령어')
                .addField('임베드 색깔보기', `${prefix}임베드 [color || 색깔]`)
                .addField('임베드 제목만 만들기', `${prefix}임베드 [color] [제목]`)
                .addField('임베드 제목 내용 만들기', `${prefix}임베드 [color] [제목] [내용]`)
            message.channel.send(helpembed)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
        }
    }
};