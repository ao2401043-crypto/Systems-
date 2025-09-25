const { Client, Collection, GatewayIntentBits, ChannelType, AuditLogEvent, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js");
const moment = require('moment');
const ms = require('ms')
const { Database } = require("st.db")
const taxDB = new Database("/Json-db/Bots/taxDB.json")
const { PermissionsBitField } = require('discord.js')
const autolineDB = new Database("/Json-db/Bots/autolineDB.json")
const suggestionsDB = new Database("/Json-db/Bots/suggestionsDB.json")
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json")
const giveawayDB = new Database("/Json-db/Bots/giveawayDB.json")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
const shortcutDB = new Database("/Json-db/Others/shortcutDB.json")
const protectDB = new Database("/Json-db/Bots/protectDB.json")
const db = new Database("/Json-db/Bots/BroadcastDB")
const logsDB = new Database("/Json-db/Bots/logsDB.json")
const nadekoDB = new Database("/Json-db/Bots/nadekoDB.json")
const one4allDB = new Database("/Json-db/Bots/one4allDB.json")
const ticketDB = new Database("/Json-db/Bots/ticketDB.json")

const path = require('path');
const { readdirSync } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// استخدام متغيرات البيئة بدلاً من config.js
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const owner = process.env.OWNER_ID;
const prefix = process.env.PREFIX || '!';

theowner = owner;
const client27 = new Client({
    intents: 131071,
    shards: "auto",
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User, Partials.GuildScheduledEvent, Partials.Reaction, Partials.ThreadMember]
});

client27.commands = new Collection();
client27.events = new Collection();
client27.one4allSlashCommands = new Collection();

const rest = new REST({ version: '10' }).setToken(token);
client27.setMaxListeners(1000);

// تحميل الأحداث
require(`./handlers/events`)(client27);
require(`./handlers/suggest`)(client27);
require('./handlers/tax4bot')(client27);
require("./handlers/autorole")(client27);
require(`./handlers/claim`)(client27);
require(`./handlers/close`)(client27);
require(`./handlers/create`)(client27);
require(`./handlers/reset`)(client27);
require(`./handlers/support-panel`)(client27);
require('./handlers/joinGiveaway')(client27);
require(`./handlers/applyCreate`)(client27);
require(`./handlers/applyResult`)(client27);
require(`./handlers/applySubmit`)(client27);
require(`./handlers/addToken`)(client27);
require(`./handlers/info`)(client27);
require(`./handlers/sendBroadcast`)(client27);
require(`./handlers/setBroadcastMessage`)(client27);

// تحميل الأوامر
const folderPath = path.join(__dirname, 'slashcommand27');
const one4allSlashCommands = [];
const ascii = require("ascii-table");
const table = new ascii("one4all commands").setJustify();

for (let folder of readdirSync(folderPath).filter((folder) => !folder.includes("."))) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) => f.endsWith(".js"))) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
            one4allSlashCommands.push(command.data.toJSON());
            client27.one4allSlashCommands.set(command.data.name, command);
            if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
            } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
            }
        }
    }
}

// تحميل الأحداث من مجلد events
for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client27.once(event.name, (...args) => event.execute(...args));
    } else {
        client27.on(event.name, (...args) => event.execute(...args));
    }
}

// حدث ready
client27.once('ready', async () => {
    console.log(`✅ ${client27.user.tag} is online!`);

    try {
        await rest.put(
            Routes.applicationCommands(client27.user.id),
            { body: one4allSlashCommands },
        );
        console.log('✅ Slash commands loaded successfully');
    } catch (error) {
        console.error('❌ Error loading slash commands:', error)
    }

    // التحقق من السيرفرات التي لديها أقل من 10 أعضاء
    client27.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`one4all bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });

    // نظام الجيف اوي
    let theguild = client27.guilds.cache.first();
    if (theguild) {
        setInterval(() => {
            let giveaways = giveawayDB.get(`giveaways_${theguild.id}`)
            if (!giveaways) return;
            giveaways.forEach(async (giveaway) => {
                let { messageid, channelid, entries, winners, prize, duration, ended } = giveaway;
                if (duration > 0) {
                    duration = duration - 1
                    giveaway.duration = duration;
                    await giveawayDB.set(`giveaways_${theguild.id}`, giveaways)
                } else if (duration == 0) {
                    duration = duration - 1
                    giveaway.duration = duration;
                    await giveawayDB.set(`giveaways_${theguild.id}`, giveaways)
                    const theroom = theguild.channels.cache.find(ch => ch.id == channelid)
                    if (!theroom) return;

                    try {
                        await theroom.messages.fetch(messageid)
                        const themsg = await theroom.messages.cache.find(msg => msg.id == messageid)
                        if (!themsg) return;

                        if (entries.length > 0 && entries.length >= winners) {
                            const theWinners = [];
                            for (let i = 0; i < winners; i++) {
                                let winner = Math.floor(Math.random() * entries.length);
                                let winnerExcept = entries.splice(winner, 1)[0];
                                theWinners.push(winnerExcept);
                            }
                            const button = new ButtonBuilder()
                                .setEmoji(`🎉`)
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId(`join_giveaway`)
                                .setDisabled(true)
                            const row = new ActionRowBuilder().addComponents(button)
                            themsg.edit({ components: [row] })
                            themsg.reply({ content: `Congratulations ${theWinners.map(w => `<@${w}>`).join(', ')}! You won the **${prize}**!` })
                            giveaway.ended = true;
                            await giveawayDB.set(`giveaways_${theguild.id}`, giveaways)
                        } else {
                            const button = new ButtonBuilder()
                                .setEmoji(`🎉`)
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId(`join_giveaway`)
                                .setDisabled(true)
                            const row = new ActionRowBuilder().addComponents(button)
                            themsg.edit({ components: [row] })
                            themsg.reply({ content: `**لا يوجد عدد من المشتركين كافي**` })
                            giveaway.ended = true;
                            await giveawayDB.set(`giveaways_${theguild.id}`, giveaways)
                        }
                    } catch (error) {
                        console.error('Error processing giveaway:', error);
                    }
                }
            })
        }, 1000);
    }
});

// باقي الأكواد (يجب التأكد من أن جميع الأكواد موجودة هنا)...

client27.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.user.bot) return;

        const command = client27.one4allSlashCommands.get(interaction.commandName);

        if (!command) {
            return;
        }

        if (command.ownersOnly === true) {
            if (owner != interaction.user.id) {
                return interaction.reply({ content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true });
            }
        }

        if (command.adminsOnly === true) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: `❗ ***يجب أن تمتلك صلاحية الأدمن لاستخدام هذا الأمر***`, ephemeral: true });
            }
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.log("🔴 | error in one4all bot", error)
            return interaction.reply({ content: 'حدث خطأ أثناء تنفيذ الأمر!', ephemeral: true });
        }
    }
});

// معالجة الأخطاء
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err)
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:', reason)
});

process.on("uncaughtExceptionMonitor", (reason) => {
    console.log('Uncaught Exception Monitor:', reason)
});

// تسجيل الدخول بالتوكن
client27.login(token).catch(error => {
    console.error('Failed to login:', error);
    process.exit(1);
});
