const { canModifyQueue } = require('./../base/botUtil');
const { deletetime } = require('./../config.json');

module.exports = {
    name: "pause",
    description: '음악 일시정지',
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send('재생되고있는 음악이 없습니다.')
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delite();
                }, deletetime)
            });
        if (!canModifyQueue(message.member)) return ;

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(`${message.author} ⏸ 노래가 일시정지 되었습니다.`)
                .catch(console.error)
                .then(m => {
                    setTimeout(function() {
                        m.delite();
                    }, deletetime)
                });
        }
    }
};