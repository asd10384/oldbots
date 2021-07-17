
require('dotenv').config();

var pl = require('./commands/play');
var Discord = require('discord.js');
var Client = require('./Client.js');
var client = new Client();
var {prefix, contest, token} = require('./config.json');
var fs = require('fs');

client.commands = new Discord.Collection();
var CommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (var file of CommandFiles) {
    var command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`디스코드 봇 활성화\n    이름 : ${client.user.tag}\n    ID : ${client.user.id}`)
    client.user.setPresence({
        status: 'online',
        activity: {
            type: "WATCHING",
            name: contest
        }
    });
});

var {MessageEmbed} = require('discord.js');
var Youtube = require('simple-youtube-api');
var ytdl = require('ytdl-core');
var {youtubeAPI} = require('./config.json');
var { title } = require('process');
var youtube = new Youtube(youtubeAPI);

var ccmm = false;
var queuetext = '__**노래 리스트**__';

client.on('message', async (message) => {


    if (message.author.bot) return;
    
    if (!message.content.startsWith(prefix)) {
        if (ccmm) {
            var chaa = fs.readFileSync('./cha.txt', 'utf8');
            var messs = fs.readFileSync('./mess.txt', 'utf8');
            var cha = bot.get_channel(chaa);
            var mess = await cha.fetch_message(messs);
        }
        if (message.channel.id.match(cha)) {
            
            var args = message.content;
            var voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send('먼저 음성채널에 들어가주세요.');
            if (args.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
                try {
                    var playlist = await youtube.getPlaylist(args);
                    var videosObj = await playlist.getVideos(10);
                    for (let i = 0; i < videosObj.length; i++) {
                        var video = await videosObj[i].fetch();
    
                        var url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                        var title = video.raw.snippet.title;
                        let duration = formatDuration(video.duration);
                        var thumbnail = video.thumbnails.high.url;
                        if (duration == '00:00') duration = 'LIVE STREAM';
                        var song = {
                            url,
                            title,
                            duration,
                            thumbnail,
                            voiceChannel
                        };
                    };
                    var messtitle = queuetext;
                    messtitle += title;
                    await mess.edit(messtitle);
                    if (message.guild.musicData.isPlaying == false) {
                        message.guild.musicData.isPlaying == true;
                        return playSong(message.guild.musicData.queue, message);
                    }
                    else if (message.guild.musicData.isPlaying == true) {
                        return message.channel.send(`Playlist - ${playlist.title}`);
                    }
                } catch (err) {
                    console.error(err)
                    return message.channel.send('재생목록이 비공개거나 존재하지 않습니다.');
                }
            }
            if (args.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
                var url = args;
                try {
                    args = args
                        .replace(/(>|>)/gi, '')
                        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                    var id = args[2].split(/[^0-9a-z_\-]/i)[0];
                    var video = await youtube.getVideoByID(id);
                    var title = video.title;
                    let duration = formatDuration(video.duration);
                    var thumbnail = video.thumbnails.high.url;
                    if (duration == '00:00') duration = 'LIVE STREAM';
                    var song = {
                        url,
                        title,
                        duration,
                        thumbnail,
                        voiceChannel
                    };
                    var messtitle = queuetext;
                    messtitle += title;
                    await mess.edit(messtitle);
                    if (message.guild.musicData.isPlaying == false || typeof message.guild.musicData.isPlaying == 'undefined') {
                        message.guild.musicData.isPlaying == true;
                        return playSong(message.guild.musicData.queue, message);
                    }
                    else if (message.guild.musicData.isPlaying == true) {
                        return message.channel.send(`Playlist - ${playlist.title}`);
                    }
                } catch (err) {
                    console.error(err);
                    return message.channel.send('오류가 발생했습니다.');
                }
            }
            try {
                var videos = await youtube.searchVideos(args, 1);
                try {
                    var video = await youtube.getVideoByID(videos[0].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send('오류가 발생했습니다.');
                }
                var url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                var title = video.title;
                let duration = formatDuration(video.duration);
                var thumbnail = video.thumbnails.high.url;
                if (duration == '00:00') duration = 'LIVE STREAM';
                var song = {
                    url,
                    title,
                    duration,
                    thumbnail,
                    voiceChannel
                }
                    var messtitle = queuetext;
                    messtitle += title;
                    await mess.edit(messtitle);
                if (message.guild.musicData.isPlaying == false) {
                    message.guild.musicData.isPlaying == true;
                    playSong(message.guild.musicData.queue, message);
                } else if (message.guild.musicData.isPlaying == true) {
                    return message.channel.send(`Playlist - ${playlist.title}`);
                }
            } catch (err) {
                console.error(err);
                return message.channel.send('요청한 곡을 찾을 수 없습니다.');
            }
            
            function playSong(queue, message) {
                queue[0].voiceChannel
                    .join()
                    .then(connection => {
                        var dispatcher = connection
                            .play(
                                ytdl(queue[0].url, {
                                    quality: 'highestaudio',
                                    highWaterMark: 1024 * 1024 * 10
                                })
                            )
                            .on('start', () => {
                                message.guild.musicData.songDispatcher = dispatcher;
                                dispatcher.setVolume(message.guild.musicData.volume);
                                var videoEmbed = new MessageEmbed()
                                    .setThumbnail(queue[0].thumbnail)
                                    .setColor('#e9f931')
                                    .addField('재생중 : ' + queue[0].title)
                                if (queue[1]) videoEmbed.addField('다음곡 : ' + queue[1].title);
                                if (message.guild.musicData.isLoop) {
                                    message.channel.send(queue[0].title + '반복재생중');
                                }
                                else {
                                    message.channel.send(videoEmbed);
                                }
                                message.guild.musicData.nowPlaying = queue[0];
                                return queue.shift();
                            })
                            .on('finish', () => {
                                if (message.guild.musicData.isLoop) {
                                    message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
                                    return playSong(queue, message);
                                }
                                else if (queue.length >= 1) {
                                    return playSong(queue, message);
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
                                return playSong(queue, message);
                            });
                    })
                    .catch(e => {
                        console.error(e);
                        return message.guild.me.voice.channel.leave();
                    });
            }
            function formatDuration(durationObj) {
                var duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
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
        }
    }

    if (!message.content.startsWith(prefix)) return;

    var commess = message.content.toString().split(' ');
    var commandName = commess[0].substr(1);

    try {
        if (commandName == 'help') {
            command.execute(message, client);
        }
        else if (commandName == 'ping') {
            command.execute(message, client);
        }
        else if (commandName == 'em') {
            command.execute(message, client);
        }
        else if (commandName == 'musicset') {
            command.execute(message, client);
            ccmm = true;
        }
        else {
            message.channel.send(`${commandName}명령어는 없는 명령어입니다.\n/help로 도움말을 확인하세요.`);
        }
    } catch (error) {
        console.error(error);
        message.channel.send(`${commandName}명령어를 실행하는 도중 오류가 발생했거나\n/help로 도움말을 확인하세요.`);
    }
});

client.login(process.env.token);