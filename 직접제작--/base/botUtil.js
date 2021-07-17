module.exports = {
    canModifyQueue(member) {
        const { channel } = member.voice;
        const botChannel = member.guild.me.voice.channel;

        if (channel !== botChannel) {
            member.send('먼저 음성채널에 들어간뒤 사용해주세요.').catch(console.error);
            return false;
        }
        return true;
    }
};