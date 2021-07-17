const { canModifyQueue } = require('./../base/botUtil');
const { deletetime } = require('./../config.json');

module.exports = {
    name: 'stop',
    description: '음악 멈춤',
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);

        if (!queue) return message.channel.send('재생되고있는 음악이 없습니다.')
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        if (!canModifyQueue(message.member)) return ;

        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.sned(`${message.author} ⏹ 노래 멈춤`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
    }
};