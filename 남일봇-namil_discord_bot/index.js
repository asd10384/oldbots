
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER']});
const { token, default_prefix, msg_time, help_time, textchannel, mongourl } = require('./config.json');
const { readdirSync } = require('fs');
const { join } = require('path');
const config = require('./config.json');
const db = require('quick.db');

// google key
const googleapi = require('./googlettsapi');
googleapi.getkeyfile();

const { creaction } = require('./modules/reaction');
const { dbset, dbset_music } = require('./modules/functions');
const { connect } = require('mongoose');
var dburl = process.env.mongourl || mongourl;
connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// const Data = require('./modules/data');
const mData = require('./modules/music_data');

client.config = config;
client.commands = new Discord.Collection();

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(join(__dirname, 'commands', `${file}`));
    client.commands.set(command.name, command);
}

client.on('error', console.error);

client.on('ready', async () => {
    var db_text = '';
    try {
        var db_key_list = Object.keys(db.all()[0]['data']);
        for (i=0; i<db_key_list.length; i++) {
            db_text += `\n       \`${i+1}. ${db_key_list[i]} \``;
            for (j=0; j<Object.keys(db.all()[0]['data'][db_key_list[i]]).length; j++) {
                var db_user_id = Object.keys(db.all()[0]['data'][db_key_list[i]])[j];
                db_text += `\n       ${db_user_id}　:　`;
                db_text += `${Object.values(db.all()[0]['data'][db_key_list[i]])[j]}\n`;
            }
        }
    } catch(err) {
        db_text = '\n       없음\n';
    }
    console.log(`

        =========================
          이름 : ${client.user.username}
        
          태그 : ${client.user.tag}
        ==========================

    `);
    console.log('       ====================');
    console.log(db_text);
    console.log('       ====================\n');

    client.user.setPresence({
        activity: {
            name: `${default_prefix}help`,
            type: 'WATCHING'
        },
        status: 'online'
    });
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    
    var prefix = await db.get(`db.prefix.${message.member.id}`);
    if (prefix == (null || undefined)) {
        await db.set(`db.prefix.${message.member.id}`, default_prefix);
        prefix = default_prefix;
    }
    mData.findOne({
        serverid: message.guild.id
    }, async function (err, data) {
        if (err) console.log(err);
        if (!data) {
            await dbset_music(message);
            return ;
        } else {
            var ttsid = data.ttsid;
            if (ttsid == null || ttsid == undefined) {
                ttsid = '123';
            }
            var musicquizid = data.channelid;
            if (musicquizid == null || musicquizid == undefined) {
                musicquizid = '123';
            }
            if (message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const commandName = args.shift().toLowerCase();
                
                const command = client.commands.get(commandName) ||
                client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));


                try {
                    await command.run(client, message, args);
                    msgdelete(300);
                } catch(error) {
                    if (commandName == '' || commandName == ';' || commandName == undefined || commandName == null) {
                        return ;
                    }
                    msgdelete(125);
                    const embed = new Discord.MessageEmbed()
                        .setColor('DARK_RED')
                        .setDescription(`\` ${commandName} \` 이라는 명령어를 찾을수 없습니다.`)
                        .setFooter(` ${prefix}help 를 입력해 명령어를 확인해 주세요.`);
                    return message.channel.send(embed).then(m => {
                        setTimeout(function() {
                            try {
                                m.delete();
                            } catch(err) {}
                        }, msg_time);
                    });
                }
            } else if (ttsid == message.channel.id) {
                try {
                    var args = message.content.trim().split(/ +/g);
                } catch(error) {
                    var args = message.content.trim().split(/ +/g);
                }
                const command = client.commands.get('tts');
                return command.run(client, message, args);
            } else if (musicquizid == message.channel.id) {
                try {
                    var args = message.content.trim().split(/ +/g);
                } catch(error) {
                    var args = message.content.trim().split(/ +/g);
                }
                if (data.start == true) {
                    const command = client.commands.get('musicanser');
                    return command.run(client, message, args);
                } else {
                    msgdelete(500);
                    const command = client.commands.get('musicquiz');
                    return command.run(client, message, args);
                }
            }
        }
    });
    function msgdelete(time) {
        setTimeout(function() {
            try {
                message.delete();
            } catch(err) {}
        }, time);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    await creaction(client, reaction, user);
});


// process.env.token
client.login(process.env.token);
