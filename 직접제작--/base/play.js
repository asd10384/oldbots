const ytdlDiscord = require('ytdl-core-discord');
const { canModifyQueue } = require('./botUtil');
const { MessageEmbed } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const { none } = require('./../config.json');

module.exports = {
    async play(song, message) {
        const queue = message.client.queue.get(message.guild.id);
        
        if (!song) {
            const { channel } = message.member.voice;
            channel.leave();
            return ;
        }

        let stream = null;
        let streamType = song.url.includes('youtube.com') ? 'opus' : 'ogg/opus';

        try {
            if (song.url.includes('youtube.com')) {
                stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
            }
        } catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }
            console.error(error);
            return message.channel.send(`Error: ${error.message ? error.message : error}`);
        }

        const queueEmbed = new MessageEmbed()
            .setTitle(`**음악 목록**`)
            .setDescription(`1. ${none}`)
            .setColor('#F8AA2A');
                            
        const playingm = new MessageEmbed()
            .setTitle(`재생중인노래`)
            .setDescription(`**${none}**`)
            .addField(`URL : ${none}`, `채널 : ${none}`)
            .setImage(`https://i.pinimg.com/originals/4a/55/80/4a5580ead960003dde51fa9acbb48f15.jpg`)
            .setAuthor(`시간 : 00:00`)
            .setColor('ORANGE');
        
        queue.connection.on('disconnect', () => {
            var queuemsg = readFileSync('./queuemsg.txt', 'utf-8');
            message.channel.messages.cache.get(queuemsg)
                .edit(queueEmbed)
                .then(m => {
                    writeFileSync('./queuemsg.txt', m.id, 'utf-8');
                });
            var playmsgid = readFileSync('./playmsg.txt', 'utf-8');
            message.channel.messages.cache.get(playmsgid)
                .edit(playingm)
                .then(m => {
                    writeFileSync('./playmsg.txt', m.id, 'utf-8');
                });
        });

        const dispatcher = queue.connection
            .play(stream, { type: streamType })
            .on('finish', () => {
                if (collector && !collector.ended) collector.stop();

                if (queue.loop) {
                    // if loop is on, push the song back at the end of the queue
                    // so it can repeat endlessly
                    let lastSong = queue.song.shift();
                    queue.songs.push(lastSong);
                    module.exports.play(queue.songs[0], message);
                } else {
                    // Recursively play the next song
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                }
            })
            .on('error', (err) => {
                console.error(err);
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        function addzero(num, digit) {
            var zero = '';
            num = num.toString();
            if (num.length < digit) {
                for (i = 0; i < digit - num.length; i++) {
                    zero += '0';
                }
            }
            return zero + num;
        }

        try {
            var hour = addzero(parseInt(parseInt(song.time / 60) / 60), 2);
            var minute = addzero(parseInt(song.time / 60) % 60, 2);
            var second = addzero(parseInt(song.time % 60), 2);


            const playingm = new MessageEmbed()
                .setTitle(`재생중인노래`)
                .setDescription(`**${song.title}**`)
                .addField(`URL : ${song.url}`, `채널 : ${song.ownername}`)
                .setImage(`https://i.ytimg.com/vi/${song.shorturl.slice(32)}/maxresdefault.jpg`)
                .setAuthor(`시간 : ${hour}:${minute}:${second}`)
                .setColor('ORANGE');
            message.client.commands.get("queue").execute(message);
            try {
                var playmsgid = readFileSync('./playmsg.txt', 'utf-8');
                message.channel.messages.cache.get(playmsgid)
                    .edit(playingm)
                    .then(m => {
                        writeFileSync('./playmsg.txt', m.id, 'utf-8');
                    });
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err)
        }

        var mrid = readFileSync('./playmsg.txt', 'utf-8');
        var mr = message.channel.messages.cache.get(mrid);
        const filter = (reaction, user) => user.id !== message.client.user.id;
        var collector = mr.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
        });

        collector.on('collect', (reaction, user) => {
            if (!queue) return ;
            const member = message.guild.member(user);

            switch (reaction.emoji.name) {
                case "⏯":
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return ;
                    if (queue.playing) {
                        queue.playing = !queue.playing;
                        queue.connection.dispatcher.pause(true);
                    } else {
                        queue.playing = !queue.playing;
                        queue.connection.dispatcher.resume();
                    }
                    break;
                
                case "⏭":
                    queue.playing = true;
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return ;
                    queue.connection.dispatcher.end();
                    collector.stop();
                    break;
                
                case "🔁":
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return ;
                    queue.loop = !queue.loop;
                    queue.textChannel.send(`반복재생 : ${queue.loop ? "**켜짐**" : "**꺼짐**"}`).catch(console.error)
                      .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, 2000)
                      });
                    break;
                
                case "⏹":
                    reaction.users.remove(user).catch(console.error);
                    if (!canModifyQueue(member)) return ;
                    queue.songs = [];
                    try {
                        queue.connection.dispatcher.end();
                    } catch (error) {
                        console.error(error);
                        queue.connection.disconnect();
                    }
                    collector.stop();
                    break;
          
                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        });

        collector.on('end', () => {
        })

    }
}