// https://discord.com/api/oauth2/authorize?client_id=769529942094118923&permissions=8&scope=bot

require('dotenv').config();

// 기본 const
const { token, prefix, deletetime } = require('./config.json');
const { readdirSync } = require('fs');
const { Client, Collection } = require('discord.js');
const { join } = require('path');
const client = new Client();

// 변수 설정
client.commands = new Collection();
client.prefix = prefix;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 클라이언트
client.login(process.env.token);

client.on('ready', async () => {
    console.log(`\n\n${client.user.tag} ready!\n`);
    await client.user.setPresence({
        activity: {
            name: `${prefix}help 를 입력`,
            type: "PLAYING"
        },
        status: 'online'
    });
});
client.on('warn', (info) => console.log(info));
client.on('error', console.error);

// 커맨드파일 받기
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}

// 메세지 받기
client.on('message', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // 쿨타임
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
                `\`${timeLeft.toFixed(1)}\`초 뒤에 다시 사용해주세요.`
            ).then(m => {
                setTimeout(function () {
                    m.delete();
                }, deletetime)
            });
        }
    }

    // 명령어 파일 실행
    timestamps.set(message.author.id, now);
    try {
        command.execute(message, args);
        message.delete();
    } catch (e) {
        console.error(e);
        message.delete();
        message.channel.send(`\`${command.name}\` 명령어를 실행하는 도중 오류가 발생했습니다.`)
            .then(m => {
                setTimeout(function () {
                    m.delete();
                }, deletetime)
            });
    }
});