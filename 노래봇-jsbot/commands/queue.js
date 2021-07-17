const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['song-list', 'next-songs', 'list', '목록' , '재생목록'],
    group: 'music',
    memberName: 'queue',
    guildOnly: true,
    description: '곡 대기열을 표시합니다.',
    
    async run(message) {
        if (message.guild.triviaData.isTriviaRunning)
            return message.say('Try again after the trivia has ended');
        if (message.guild.musicData.queue.length == 0)
            return message.say('현재 대기열에 곡이 없습니다.');
        const titleArray = [];
        message.guild.musicData.queue.map(obj => {
            titleArray.push(obj.title);
        });
        var queueEmbed = new MessageEmbed()
            .setColor('#ff7373')
            .setTitle('Music Queue');
        for (let i = 0; i < titleArray.length; i++) {
            queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
        }
        return message.say(queueEmbed);
    }
};
