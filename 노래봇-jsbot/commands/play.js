
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const { youtubeAPI } = require('../config.json');
const youtube = new Youtube(youtubeAPI);

async function run(message) {
    var cut = message.split(' ');
    var query = cut.slice(1).join(' ');
    
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('음성채널에 진입후 사용해주세요.');
    if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
        try {
            const playlist = await youtube.getPlaylist(query);
            const videosObj = await playlist.getVideos(10);
            for (let i = 0; i < videosObj.length; i++) {
                const video = await videosObj[i].fetch();
    
                const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                const title = video.raw.snippet.title;
                let duration = this.formatDuration(video.duration);
                const thumbnail = video.thumbnails.high.url;
                if (duration == '00:00') duration = 'Live Stream';
                const song = {
                    url,
                    title,
                    duration,
                    thumbnail,
                    voiceChannel
                };
            };
            message.guild.musicData.queue.push(song);
    
            if (message.guild.musicData.isPlaying == false) {
                message.guild.musicData.isPlaying == true;
                return this.playSong(message.guild.musicData.queue, message);
            }
            else if (message.guild.musicData.isPlaying == true) {
                return message.channel.send(`Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`);
            }
        } catch (error) {
            console.error(error);
            return message.channel.send('재생목록이 비공개거나 존재하지 않습니다.');
        }
    }
    
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
        const url = query;
        try {
            query = query
                .replace(/(>|>)/gi, '')
                .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            const id = query[2].split(/[^0-9a-z_\-]/i)[0];
            const video = await youtube.getVideoByID(id);
            const title = video.title;
            let duration = this.formatDuration(video.duration);
            const thumbnail = video.thumbnails.high.url;
            if (duration == '00:00') duration = 'Live Stream';
            const song = {
                rul,
                title,
                duration,
                thumbnail,
                voiceChannel
            };
            message.guild.musicData.queue.push(song);
            if (message.guild.musicData.isPlaying == false || typeof message.guild.musicData.isPlaying == 'undefined') {
                message.guild.musicData.isPlaying == true;
                return this.playSong(message.guild.musicData.queue, message);
            }
            else if (message.guild.musicData.isPlaying == true) {
                return;
            }
        } catch (error) {
            console.error(error);
            return message.channel.send('오류가 발생했습니다.');
        }
    }
    try {
        const videos = await youtube.searchVideos(query, 1);
        try {
            var video = await youtube.getVideoByID(videos[0].id);
        } catch (error) {
            console.error(error);
            return message.channel.send('오류가 발생했습니다.');
        }
            
        const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
        const title = video.title;
        let duration = this.formatDuration(video.duration);
        const thumbnail = video.thumbnails.high.url;
        if (duration == '00:00') duration = 'Live Stream';
        const song = {
            url,
            title,
            duration,
            thumbnail,
            voiceChannel
        };
        message.guild.musicData.queue.push(song);
        if (message.guild.musicData.isPlaying == false) {
            message.guild.musicData.isPlaying == true;
            this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
            return;
        }
    } catch (error) {
        console.error(error);
        return message.channel.send('요청한 곡을 찾을 수 없습니다.');
    }
}
function playSong(queue, message) {
    queue[0].voiceChannel
        .join()
        .then(connection => {
            const dispatcher = connection
                .play(
                    ytdl(queue[0].url, {
                        quality: 'highestaudio',
                        highWaterMark: 1024 * 1024 * 10
                    })
                )
                .on('start', () => {
                    message.guild.musicData.songDispatcher = dispatcher;
                    dispatcher.setVolume(message.guild.musicData.volume);
                    const videoEmbed = new MessageEmbed()
                        .setThumbnail(queue[0].thumbnail)
                        .setColor('#e9f931')
                        .addField('재생 중 : ', queue[0].title)
                        .addField('길이 : ', queue[0].duration);
                    if (queue[1]) videoEmbed.addField('다음 곡 : ', queue[1].title);
                    if (message.guild.musicData.isLoop) {
                        message.channel.send(queue[0].title + '반복 재생 중');
                    }
                    else {
                        message.channel.send(videoEmbed);
                    }
                    message.guild.musicData.nowPlaying = queue[0];
                    return queue.shift();
                })
                .on('finish', () => {
                    if(message.guild.musicData.isLoop) {
                        message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
                        return this.playSong(queue, message);
                    }
                    else if (queue.length >= 1) {
                        return this.playSong(queue, message);
                    }
                    else {
                        message.guild.musicData.isPlaying = false;
                        message.guild.musicData.nowPlaying = null;
                        return message.guild.me.voice.channel.leave();
                    }
                })
                .on('error', e => {
                    message.channel.send('곡을 재생하는데 오류가 발생했습니다.');
                    console.error(e);
                    return this.playSong(queue, message);
                });
        })
        .catch(e => {
            console.error(e);
            return message.guild.me.voice.channel.leave();
        });
}
function formatDuration(durationObj) {
    const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
        durationObj.minutes ? durationObj.minutes : '00'
    }:${
        durationObj.seconds < 10
            ? '0' + durationObj.seconds
            : durationObj.seconds
            ? durationObj.seconds
            : '00'
    }`;
    return duration;
}