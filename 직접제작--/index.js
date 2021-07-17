
/* 임포트 명령어들

npm install --save discord.js
npm install --save fs
npm install --save path
npm install --save ytdl-core
npm install --save ytdl-core-discord
npm install --save simple-youtube-api
npm install --save @discordjs/opus
npm install --save string-progressbar
npm install --save node-opus
npm install --save opusscript
npm install --save ffmpeg-binaries

*/

// 모듈러
const { Client, Collection } = require('discord.js');
const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { token, prefix, deletetime, setting } = require('./config.json');

const client = new Client();

client.login(token);

client.commands = new Collection();
client.prefix = prefix;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 클라이언트
client.on('ready', () => {
    console.log(`\n\n${client.user.tag} ready!\n${setting}\n`);
    client.user.setActivity(`${prefix}help`);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

//커맨드 임포트
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}

// 메시지
client.on('message', async (message) => {
    if (message.author.bot) return ;
    if (!message.guild) return ;

    var msg = message.content.toString();
    var botch = readFileSync('./textchannel.txt', 'utf-8');
    if (msg[0] != prefix && message.channel.id.toString() === botch) {
        message.client.commands.get('play').execute(message, [msg]);
        message.delete();
    }

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return ;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = 
        client.commands.get(commandName) || 
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return ;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            message.delete();
            return message.channel.send(
                `\`${command.name}\` 명령어 오류방지를 위해 ${timeLeft.toFixed(1)}초뒤에 다시 입력해주세요.`
            ).then(m => {
                setTimeout(function() {
                    m.delete();
                }, deletetime);
            });
        }
    }

    timestamps.set(message.author.id, now);
    try {
        command.execute(message, args);
        setTimeout(function() {
            message.delete();
        }, 500);
    } catch (e) {
        console.error(e);
        message.channel.send(`\`${command.name}\` 명령어를 실행하는 도중 오류가 발생했습니다.`)
            .catch(console.error)
            .then(m => {
                setTimeout(function () {
                    m.delete();
                }, deletetime)
            });
    }

});