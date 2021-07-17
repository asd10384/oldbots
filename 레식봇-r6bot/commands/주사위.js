const { MessageEmbed } = require('discord.js');
const { prefix, deletetime, dicemax } = require('./../config.json');

module.exports = {
    name: '주사위',
    aliases: ['dice'],
    cooldown: 0,
    description: '주사위굴리기',
    execute(message) {
        const args = message.content.split(/ /gi);
        if (args.length >= 2) {
            try {
                var count = Number(args[1]);
            } catch (e) {
                message.channel.send(`주사위 갯수는 숫자로 넣어주세요.\n( error : ${args[1]})`)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
            }
            if (count >= 1) {
                if (count <= dicemax) {
                    const embed = new MessageEmbed()
                        .setColor('RANDOM')
                        .setFooter('이 임베드색깔은 랜덤 입니다.');
                    var dice = '';
                    for (i = 1; i <= count; i++) {
                        var r = Math.floor(Math.random() * 6 + 1);
                        switch (r) {
                            case 1:
                                var im = ':one:';
                                break;
                            case 2:
                                var im = ':two:';
                                break;
                            case 3:
                                var im = ':three:';
                                break;
                            case 4:
                                var im = ':four:';
                                break;
                            case 5:
                                var im = ':five:';
                                break;
                            case 6:
                                var im = ':six:';
                                break;
                            default:
                                var im = '오류';
                                break;
                        }
                        if (i < 10) {
                            i = `0${i}`;
                        }
                        dice += (`${i}번째주사위 - **${im}**\n`);
                    }
                    embed.setDescription(dice);
                    message.channel.send(embed)
                        .then(m => {
                            setTimeout(function() {
                                m.delete();
                            }, deletetime + 5000)
                        });
                } else {
                    message.channel.send(`주사위 갯수는 ${dicemax}보다 작아야합니다.`)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
                }
            } else {
                message.channel.send(`주사위 갯수는 1보다 커야합니다.`)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
            }
        } else {
            message.channel.send(`${prefix}주사위 [주사위 갯수]`)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
        }
    }
};