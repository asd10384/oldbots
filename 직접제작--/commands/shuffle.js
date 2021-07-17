const { canModifyQueue } = require('./../base/botUtil');
const { deletetime } = require('./../config.json');

module.exports = {
    name: 'shuffle',
    description: '목록 뒤섞기',
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send('재생목록이 없습니다.')
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        if (!canModifyQueue(message.member)) return ;

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        queue.textChannel.send(`${message.author} 🔀 목록을 뒤섞음`);
    }
};