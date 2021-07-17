const { play } = require('./../base/play');
const { prefix, deletetime } = require('./../config.json');

module.exports = {
    name: 'move',
    aliases: ["m"],
    description: "음악 위치 조정",
    execute(message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel
            .send("재생중인 음악이 없습니다.")
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        
        if (!args[0]) {
            message.channel.send(`${prefix}move <time>`)
                .catch(console.error)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
        } else {
            
        }
    }
};