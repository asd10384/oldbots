const fs = require('fs');
const cconfig = require('../config.json');

module.exports = {
    name: 'musicset',
    description: '노래 재생 세팅',
    usage: '/musicset',
    execute(message) {      
        message.guild.channels.create(`asdmusic`).then(channel => {
            channel.setTopic('asdmusic 채널입니다.');
            channel.send(`__**노래 리스트**__\n예약된노래가 없습니다.`).then(mess => {
                fs.writeFile('./mess.txt', mess.id, 'utf8', function(error) {
                    return;
                });
            })
            fs.writeFile('./cha.txt', channel.id, 'utf8', function(error) {
                return;
            });
        })
    },
};