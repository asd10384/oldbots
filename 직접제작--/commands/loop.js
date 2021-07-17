const { canModifyQueue } = require('./../base/botUtil');
const { deletetime } = require('./../config.json');

module.exports = {
    name: 'loop',
    aliases: ['l'],
    description: '음악 반복재생',
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send('재생되고있는 노래가 없습니다.')
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        if (!canModifyQueue(message.member)) return ;

        // toggle from false to true and reverse
        queue.loop = !queue.loop;
        return queue.textChannel
            .send(`반복재생 : ${queue.loop ? "**on**" : "**off**"}`)
            .catch(console.error);
    }
};