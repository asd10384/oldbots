const { play } = require('./../base/play');
const { YOUTUBE_API_KEY, deletetime } = require('./../config.json');
const ytdl = require('ytdl-core');
const YouTubeApi = require('simple-youtube-api');
const youtube = new YouTubeApi(YOUTUBE_API_KEY);
const { MessageEmbed } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');

module.exports = {
    name: 'play',
    aliases: ['p'],
    cooldown: 2,
    description: '유튜브에서 노래를 재생합니다.',
    async execute(message, args) {
        const msgch = message.channel;
        const { channel } = message.member.voice;

        const serverQueue = message.client.queue.get(message.guild.id);

        if (!channel) return msgch
            .send('먼저 음성채널에 들어간뒤 사용해주세요.')
            .catch(console.error)
            .then(m => {
                setTimeout(function () {
                    m.delete();
                }, deletetime)
            });
        if (message.guild.me.voice.channel) {
            if (serverQueue && channel !== message.guild.me.voice.channel)
                return msgch
                    .send(`${message.client.user}봇과 같은 음성채널에서 사용해주세요.`)
                    .catch(console.error)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, 2500)
                    });
        }
        
        if (!args.length) return msgch
            .send(`${message.client.prefix}play <YouTube URL | Video Name>`)
            .catch(console.error)
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, 2500)
                });
        
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT'))
            return msgch.send('음성에 연결할수 없음. 봇의 권한 확인바람');
        if (!permissions.has('SPEAK'))
            return msgch.send('소리를 내보낼수 없음. 봇의 권한 확인바람');
            
        const search = args.join(' ');
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return message.client.commands.get("playlist").execute(message, args);
        }

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let songInfo = null;
        let song = null;

        if (urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    time: songInfo.videoDetails.lengthSeconds,
                    ownername: songInfo.videoDetails.ownerChannelName,
                    ownerurl: songInfo.videoDetails.ownerProfileUrl,
                    shorturl: songInfo.videoDetails.video_url
                };
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const results = await youtube.searchVideos(search, 1);
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    time: songInfo.videoDetails.lengthSeconds,
                    ownername: songInfo.videoDetails.ownerChannelName,
                    ownerurl: songInfo.videoDetails.ownerProfileUrl,
                    shorturl: songInfo.videoDetails.video_url
                };
            } catch (err) {
                console.error(err);
                return msgch.send('영상을 찾지 못했습니다.')
                    .catch(console.error)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
            }
        }

        if (message.guild.me.voice.channel) {
            if (serverQueue) {
                serverQueue.songs.push(song);
                return message.client.commands.get("queue").execute(message);
            }
        }

        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            queueConstruct.connection = await channel.join();
            await queueConstruct.connection.voice.setSelfDeaf(true);
            play(queueConstruct.songs[0], message);
        } catch (err) {
            console.error(err);
            await channel.leave();
            return msgch.send(`채널에 들어갈수 없습니다. [${err}]`).catch(console.error);
        }
    }
};