const { MessageEmbed } = require('discord.js');
const { prefix, deletetime } = require('./../config.json');

module.exports = {
    name: '공격랜덤',
    aliases: ['돌격랜덤', '공격', '공'],
    cooldown: 0,
    description: '공격오퍼 무작위',
    execute(message) {
        const op = [
            "ACE",
            "AMARU",
            "ASH",
            "BLACKBEARD",
            "BLITZ",
            "BUCK",
            "CAPITAO",
            "DOKKAEBI",
            "FINKA",
            "FUZE",
            "GLAZ",
            "GRIDLOCK",
            "HIBANA",
            "IANA",
            "IQ",
            "JACKAL",
            "KALI",
            "LION",
            "MAVERICK",
            "MONTAGNE",
            "NOKK",
            "NOMAD",
            "SLEDGE",
            "THATCHER",
            "THERMITE",
            "TWITCH",
            "YING",
            "ZERO",
            "ZOFIA",
        ];
        const image = [
            "https://r6.op.gg/images/operators/badges/badge-ace.f898bd77.png",
            "https://r6.op.gg/images/operators/badges/badge-amaru.24a70133.png",
            "https://r6.op.gg/images/operators/badges/badge-ash.16913d82.png",
            "https://r6.op.gg/images/operators/badges/badge-blackbeard.fccd7e2c.png",
            "https://r6.op.gg/images/operators/badges/badge-blitz.cd45df08.png",
            "https://r6.op.gg/images/operators/badges/badge-buck.2fc3e097.png",
            "https://r6.op.gg/images/operators/badges/badge-capitao.6603e417.png",
            "https://r6.op.gg/images/operators/badges/badge-dokkaebi.2f83a34f.png",
            "https://r6.op.gg/images/operators/badges/badge-finka.71d3a243.png",
            "https://r6.op.gg/images/operators/badges/badge-fuze.9e7e9222.png",
            "https://r6.op.gg/images/operators/badges/badge-glaz.43dd3bdf.png",
            "https://r6.op.gg/images/operators/badges/badge-gridlock.6b572bdc.png",
            "https://r6.op.gg/images/operators/badges/badge-hibana.c2a8477d.png",
            "https://r6.op.gg/images/operators/badges/badge-iana.6fa68bc8.png",
            "https://r6.op.gg/images/operators/badges/badge-iq.b1acee1a.png",
            "https://r6.op.gg/images/operators/badges/badge-jackal.0326ca29.png",
            "https://r6.op.gg/images/operators/badges/badge-kali.ff0fee46.png",
            "https://r6.op.gg/images/operators/badges/badge-lion.69637075.png",
            "https://r6.op.gg/images/operators/badges/badge-maverick.7eab7c75.png",
            "https://r6.op.gg/images/operators/badges/badge-montagne.2078ee84.png",
            "https://r6.op.gg/images/operators/badges/badge-nakk.d3b4f1af.png",
            "https://r6.op.gg/images/operators/badges/badge-nomad.dbd9a315.png",
            "https://r6.op.gg/images/operators/badges/badge-sledge.00141f92.png",
            "https://r6.op.gg/images/operators/badges/badge-thatcher.b1cac8e7.png",
            "https://r6.op.gg/images/operators/badges/badge-thermite.9010fa33.png",
            "https://r6.op.gg/images/operators/badges/badge-twitch.83cbfa97.png",
            "https://r6.op.gg/images/operators/badges/badge-ying.b88be612.png",
            "https://r6.op.gg/images/operators/badges/badge-zero.050263d1.png",
            "https://r6.op.gg/images/operators/badges/badge-zofia.2a892bf5.png",
        ];

        const args = message.content.split(/ /gi);
        const r = Math.floor(Math.random() * 30);
        const r2 = Math.floor(Math.random() * 3 + 1);
        const embed = new MessageEmbed()
            .setColor('ORANGE');
        if (args.length >= 2) {
            if (args[1] == '무기' || args[1] == 'wp') {
                embed.addField(`당신의 공격오퍼`, `${op[r]}`)
                    .addField(`당신의 무기`, `**${r2}**번째 무기)`)
                    .setThumbnail(image[r])
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
            } else if (args[1] == '랜덤') {
                embed.addField(`당신의 공격오퍼`, `${op[r]}`)
                    .setThumbnail(image[r])
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
                message.channel.send(`${prefix}공격랜덤 무기`)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
            }
        } else {
            embed.addField(`당신의 공격오퍼`, `${op[r]}`)
                .setThumbnail(image[r])
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