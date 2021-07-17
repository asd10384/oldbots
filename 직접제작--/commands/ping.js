
module.exports = {
    name: 'ping',
    description: '핑 확인',
    execute(message) {
        message.channel.send(`ping?`)
            .then(m => {
                var ping = m.createdTimestamp - message.createdTimestamp;
                m.edit(`**PONG!** ${ping}ms`);
            });
    }
};