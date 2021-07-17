const { MessageEmbed } = require('discord.js');
const { prefix, deletetime } = require('./../config.json');

module.exports = {
    name: '수비랜덤',
    aliases: ['방어랜덤', '수비', '수'],
    cooldown: 0,
    description: '수비오퍼 무작위',
    execute(message) {
        const op = [
            "ALIBI",
            "BANDIT",
            "CASILE",
            "CAVEIRA",
            "CLASH",
            "DOC",
            "ECHO",
            "ELA",
            "FROST",
            "GOYO",
            "JAGER",
            "KAID",
            "KAPKAN",
            "LESION",
            "MAESTRO",
            "MELUSI",
            "MIRA",
            "MOZZIE",
            "MUTE",
            "ORYX",
            "PULSE",
            "ROOK",
            "SMOKE",
            "TACHANKA",
            "VALKYRIE",
            "VIGIL",
            "VAMAI",
            "WARDEN",
        ];
        const image = [
            "https://r6.op.gg/images/operators/badges/badge-alibi.7fba8d33.png",
            "https://r6.op.gg/images/operators/badges/badge-bandit.385144d9.png",
            "https://r6.op.gg/images/operators/badges/badge-castle.378f8f4e.png",
            "https://r6.op.gg/images/operators/badges/badge-caveira.757e9259.png",
            "https://r6.op.gg/images/operators/badges/badge-clash.133f243d.png",
            "https://r6.op.gg/images/operators/badges/badge-doc.29fe751b.png",
            "https://r6.op.gg/images/operators/badges/badge-echo.a77c7d7e.png",
            "https://r6.op.gg/images/operators/badges/badge-ela.63ec2d26.png",
            "https://r6.op.gg/images/operators/badges/badge-frost.e5362220.png",
            "https://r6.op.gg/images/operators/badges/badge-goyo.3e765688.png",
            "https://r6.op.gg/images/operators/badges/badge-jager.600b2773.png",
            "https://r6.op.gg/images/operators/badges/badge-kaid.ae2bfa7a.png",
            "https://r6.op.gg/images/operators/badges/badge-kapkan.562d0701.png",
            "https://r6.op.gg/images/operators/badges/badge-lesion.07c3d352.png",
            "https://r6.op.gg/images/operators/badges/badge-maestro.b6cf7905.png",
            "https://r6.op.gg/images/operators/badges/badge-melusi.f93b3d64.png",
            "https://r6.op.gg/images/operators/badges/badge-mira.22fb72a5.png",
            "https://r6.op.gg/images/operators/badges/badge-mozzie.adeac188.png",
            "https://r6.op.gg/images/operators/badges/badge-mute.3e4f2b01.png",
            "https://r6.op.gg/images/operators/badges/badge-oryx.6472c8ee.png",
            "https://r6.op.gg/images/operators/badges/badge-pulse.9de627c5.png",
            "https://r6.op.gg/images/operators/badges/badge-rook.eb954a4e.png",
            "https://r6.op.gg/images/operators/badges/badge-smoke.874e9888.png",
            "https://r6.op.gg/images/operators/badges/badge-tachanka.ae7943f0.png",
            "https://r6.op.gg/images/operators/badges/badge-valkyrie.f87cb6bd.png",
            "https://r6.op.gg/images/operators/badges/badge-vigil.4db5385b.png",
            "https://r6.op.gg/images/operators/badges/badge-wamai.4e4bf506.png",
            "https://r6.op.gg/images/operators/badges/badge-warden.fd12fbd9.png",
        ];

        const args = message.content.split(/ /gi);
        const r = Math.floor(Math.random() * 29);
        const r2 = Math.floor(Math.random() * 3 + 1);
        const embed = new MessageEmbed()
            .setColor('ORANGE');
        if (args.length >= 2) {
            if (args[1] == '무기' || args[1] == 'wp') {
                embed.addField(`당신의 수비오퍼`, `${op[r]}`)
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
                embed.addField(`당신의 수비오퍼`, `${op[r]}`)
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
                message.channel.send(`${prefix}수비랜덤 무기`)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
            }
        } else {
            embed.addField(`당신의 수비오퍼`, `${op[r]}`)
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