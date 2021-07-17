const { canModifyQueue } = require('./../base/botUtil');
const { deletetime } = require('./../config.json');

module.exports = {
    name: 'skipto',
    aliases: ['sk'],
    description: '원하는 곡까지 스킵',
    execute(message, args) {
        if (!args.length) return message.channel
            .send(`Usage: ${message.client.prefix}${module.exports.name}<Queue Number>`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        
        if (isNaN(args[0])) return message.channel
            .send(`Usage: ${message.client.prefix}${module.exports.name}<Queue Number>`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send('재생목록이 없습니다.')
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        if (!canModifyQueue(message.member)) return ;

        if (args[0] > queue.songs.length) return message.channel
            .send(`The queue is only ${queue.songs.length} songs long!`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        
        queue.palying = true;
        if (queue.loop) {
            for (let i = 0; i < args[0] - 2; i++) {
                queue.songs.push(queue.songs.shift());
            }
        } else {
            queue.songs = queue.songs.slice(args[0] - 2);
        }
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏭ ${args[0] - 1}곡을 스킵했습니다.`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
    }
};