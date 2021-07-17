
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { default_prefix, msg_time, help_time, drole, mongourl } = require('../config.json');

const { dbset, dbset_music } = require('../modules/functions');
const { play_anser } = require('../modules/music/start/play_anser');
const { play_skip } = require('../modules/music/start/play_skip');
const { play_hint } = require('../modules/music/start/play_hint');

const { connect } = require('mongoose');
var dburl = process.env.mongourl || mongourl; // config 수정
connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require('../modules/music_data');
/*
Data.findOne({
    serverid: message.guild.id
}, async function (err, data) {
    if (err) console.log(err);
    if (!data) {
        await dbset_music(message);
    }
});
*/
// await data.save().catch(err => console.log(err));

module.exports = {
    name: 'musicanser',
    aliases: [],
    description: 'anser',
    async run (client, message, args) {
        function msgdelete(m, t) {
            setTimeout(function() {
                try {
                    m.delete();
                } catch(err) {}
            }, t)
        }
        var pp = db.get(`dp.prefix.${message.member.id}`);
        if (pp == (null || undefined)) {
            await db.set(`db.prefix.${message.member.id}`, default_prefix);
            pp = default_prefix;
        }
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        const em = new MessageEmbed()
            .setColor('ORANGE');
        
        // if (!(message.member.permissions.has(drole))) return message.channel.send(per).then(m => msgdelete(m, msg_time));

        
        Data.findOne({
            serverid: message.guild.id
        }, async function (err, data) {
            if (err) console.log(err);
            if (!data) {
                await dbset_music(message);
            }
            var text = args.join(' ').trim().toLowerCase();

            var count = data.count;
            var name = data.name[count];
            var vocal = data.vocal[count];
            
            var anl = data.anser_list;
            var anser = ``;
            if (anl[data.anser] == '제목') {
                anser = `${name}`.trim().toLowerCase();
            }
            if (anl[data.anser] == '가수') {
                anser = `${vocal}`.trim().toLowerCase();
            }
            if (anl[data.anser] == '제목-가수') {
                anser = `${name}-${vocal}`.trim().toLowerCase();
            }
            if (anl[data.anser] == '가수-제목') {
                anser = `${vocal}-${name}`.trim().toLowerCase();
            }

            if (text == anser) {
                data.sthas = false;
                await data.save().catch(err => console.log(err));
                return await play_anser(message, client, args);
            }
            if (text == '스킵' || text == 'skip') {
                return await play_skip(client, message, message.author.id);
            }
            if (text == '힌트' || text == 'hint') {
                return await play_hint(client, message, message.author.id);
            }
        });
    },
};
