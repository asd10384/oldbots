const { canModifyQueue } = require('./../base/botUtil');
const { deletetime } = require('./../config.json');

module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: '음악 스킵',
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue)
            return message.channel.send('스킵할 음악이 없습니다.')
                .catch(console.error)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
        if (!canModifyQueue(message.member)) return ;
  
        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏭ 노래 스킵함`).catch(console.error);
    }
  };
  