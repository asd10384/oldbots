const { canModifyQueue } = require('./../base/botUtil');
const { deletetime, deletetime2 } = require('./../config.json');

module.exports = {
    name: "volume",
    aliases: ["v"],
    description: "볼륨조절",
    execute(message, args) {
        var msgch = message.channel;
        const queue = message.client.queue.get(message.guild.id);

        if (!queue) return msgch
            .send("플레이어가 없습니다.")
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        if (!canModifyQueue(message.member))
            return msgch
                .send("음성채널에 먼저 들어간 다음 사용해주세요.")
                .catch(console.error)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });

        if (!args[0]) return msgch
            .send(`🔊 **${queue.volume}%**`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime2)
            });
        if (isNaN(args[0])) return msgch
            .send("뒤에 숫자를 붙쳐주세요.")
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
            return msgch
                .send("0 - 100 사이에 숫자로 입력해주세요.")
                .catch(console.error)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

        return queue.textChannel.send(`🔊 **${args[0]}%**`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime2)
            });
    }
};
