const { MessageEmbed } = require("discord.js");
const { play } = require("./../base/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE, deletetime, deletetime2 } = require("./../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
    name: "playlist",
    aliases: ["pl"],
    cooldown: 4,
    description: "유튜브에서 플레이리스트를 가져옵니다.",
    async execute(message, args) {
        var msgch = message.channel;
        const { PRUNING } = require("./../config.json");
        const { channel } = message.member.voice;
  
        const serverQueue = message.client.queue.get(message.guild.id);
        if (message.guild.me.voice.channel) {
            if (serverQueue && channel !== message.guild.me.voice.channel)
                return msgch.send(`봇과 같은 음성채널에서 사용해주세요.`)
                    .catch(console.error)
                    .then(m => {
                        setTimeout(function() {
                            m.delete();
                        }, deletetime)
                    });
        }
  
        if (!args.length)
            return msgch
              .send(`Usage: ${message.client.prefix}playlist <YouTube Playlist URL | Playlist Name>`)
              .catch(console.error)
              .then(m => {
                  setTimeout(function() {
                      m.delete();
                  }, deletetime)
              });
        if (!channel) return msgch.send("먼저 음성채널에 들어간뒤 사용해주세요.")
            .catch(console.error)
            .then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime)
            });
  
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return msgch.send("음성채널에 연결할수 없음. 권한 확인바람")
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
        if (!permissions.has("SPEAK"))
            return msgch.send("음성에서 말할수 없음. 권한 확인바람")
                .then(m => {
                    setTimeout(function() {
                        m.delete();
                    }, deletetime)
                });
  
        const search = args.join(" ");
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);
  
        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };
  
        let song = null;
        let playlist = null;
        let fristvideos = [];
        let videos = [];
  
        if (urlValid) {
            try {
                playlist = await youtube.getPlaylist(url, { part: "snippet" });
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return msgch.send("플레이리스트를 찾을수 없습니다.")
                  .catch(console.error)
                  .then(m => {
                      setTimeout(function() {
                          m.delete();
                      }, deletetime)
                  });
            }
        } else {
            try {
                const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                playlist = results[0];
                fristvideos = await playlist.getVideos(1, { part: "snippet" });
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return msgch.send("플레이리스트를 찾을수 없습니다.")
                  .catch(console.error)
                  .then(m => {
                      setTimeout(function() {
                          m.delete();
                      }, deletetime)
                  });
            }
        }
  
        videos.forEach((video) => {
            song = {
                title: video.title,
                url: video.video_url,
                duration: video.lengthSeconds,
                time: video.lengthSeconds,
                ownername: video.ownerChannelName,
                ownerurl: video.ownerProfileUrl,
                shorturl: video.video_url
            };
  
            if (message.guild.me.voice.channel) {
                if (serverQueue) {
                    serverQueue.songs.push(song);
                    if (!PRUNING)
                        return message.client.commands.get("queue").execute(message);
                } else {
                    queueConstruct.songs.push(song);
                }
            }
        });
  
        let playlistEmbed = new MessageEmbed()
            .setTitle(`${playlist.title}`)
            .setURL(playlist.url)
            .setColor("#F8AA2A")
            .setTimestamp();
  
        if (!PRUNING) {
            playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
            if (playlistEmbed.description.length >= 4096)
                playlistEmbed.description =
                    playlistEmbed.description.substr(0, 4014) + "\nPlaylist larger than character limit...";
        }
  
        if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);
  
        if (!serverQueue) {
            try {
                return message.channel
                    .send(`${message.author}\n먼저 아무곡이나 재생한 뒤, \n플레이리스트를 추가하실수 있습니다.`)
                    .catch(console.error)
                    .then(m => {
                       setTimeout(function() {
                           m.delete();
                       }, 7000)
                    });
            } catch (error) {
                console.error(error);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(`채널에 들어갈수 없음: ${error}`)
                  .catch(console.error)
                  .then(m => {
                      setTimeout(function() {
                          m.delete();
                      }, deletetime)
                  });
            }
        }
    }
};
