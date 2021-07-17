const { roleid, deletetime, botchannelname, none } = require('./../config.json');
const { writeFileSync } = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'musicset',
    aliases: ['ms'],
    description: '음악관련 세팅',
    async execute(message) {
        if (roleid.role && !(message.member.roles.cache.has(roleid.admin || roleid.subadmin))) {
            message.channel.send('이 명령어를 사용할 권한이 없습니다.')
                .catch(console.error)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
        } else {
            const channelname = botchannelname.replace(/ /gi, '_');
            message.guild.channels.create(channelname, { type: 'text' })
                .catch(console.error)
                .then(c => {
                    try {
                        writeFileSync('./textchannel.txt', c.id, 'utf-8');

                        const queueEmbed = new MessageEmbed()
                            .setTitle(`**음악 목록**`)
                            .setDescription(`1. ${none}`)
                            .setColor('#F8AA2A');
                            
                        const playingm = new MessageEmbed()
                            .setTitle(`재생중인노래`)
                            .setDescription(`**${none}**`)
                            .addField(`URL : ${none}`, `채널 : ${none}`)
                            .setImage(`https://i.pinimg.com/originals/4a/55/80/4a5580ead960003dde51fa9acbb48f15.jpg`)
                            .setAuthor(`시간 : ${none}`)
                            .setColor('ORANGE');

                        message.guild.channels.cache.get(c.id)
                            .send(queueEmbed)
                            .then(m => {
                                writeFileSync('./queuemsg.txt', m.id, 'utf-8');
                            });
                        message.guild.channels.cache.get(c.id)
                            .send(playingm)
                            .catch(console.error)
                            .then(m => {
                                writeFileSync('./playmsg.txt', m.id, 'utf-8');
                                m.react('⏯');
                                m.react('⏭');
                                m.react('🔁');
                                m.react('⏹');
                            });
                    } catch(e) {
                        console.log(e);
                    }
                });
        }
    }
};