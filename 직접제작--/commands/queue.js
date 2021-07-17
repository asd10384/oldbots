const { MessageEmbed, splitMessage, escapeMarkdown } = require('discord.js');
const { deletetime } = require('./../config.json');
const { readFileSync, writeFileSync } = require('fs');

module.exports = {
    name: 'queue',
    aliases: ["q"],
    description: "음악 목록확인",
    execute(message) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel
            .send(`재생중인 노래가 없습니다.`)
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
        
            const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

        let queueEmbed = new MessageEmbed()
            .setTitle(`**음악 목록**`)
            .setDescription(description)
            .setColor('#F8AA2A');

        const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: "\n",
            prepend: "",
            append: ""
        });

        splitDescription.forEach(async (m) => {
            queueEmbed.setDescription(m);

            var queuemsg = readFileSync('./queuemsg.txt', 'utf-8');
            message.channel.messages.cache.get(queuemsg)
                .edit(queueEmbed)
                .then(m => {
                    writeFileSync('./queuemsg.txt', m.id, 'utf-8');
                });
        });
    }
};