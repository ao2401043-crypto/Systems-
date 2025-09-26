const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/logsDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName("setup-logs")
        .setDescription("تسطيب نظام اللوج")
        .addChannelOption(option =>
            option.setName("messagedelete")
                .setDescription("روم لوج حذف الرسائل")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("messageupdate")
                .setDescription("روم لوج تعديل الرسائل")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("rolecreate")
                .setDescription("روم انشاء رتبة")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("roledelete")
                .setDescription("روم حذف رتبة")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("rolegive")
                .setDescription("روم اعطاء رتبة")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("roleremove")
                .setDescription("روم سحب رتبة")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("channelcreate")
                .setDescription("روم انشاء قناة")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("channeldelete")
                .setDescription("روم حذف قناة")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("botadd")
                .setDescription("روم عند دخول بوت")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("banadd")
                .setDescription("روم عند اعطاء شخص بان")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("bandelete")
                .setDescription("روم عند فك بان شخص")
                .setRequired(false))
        .addChannelOption(option =>
            option.setName("kickadd")
                .setDescription("روم عند طرد شخص")
                .setRequired(false)),

    async execute(interaction) {
        // نجيب القنوات
        const options = [
            "messagedelete", "messageupdate",
            "rolecreate", "roledelete", "rolegive", "roleremove",
            "channelcreate", "channeldelete",
            "botadd", "banadd", "bandelete", "kickadd"
        ];

        for (const opt of options) {
            const channel = interaction.options.getChannel(opt);
            if (channel) {
                await db.set(`log_${opt}_${interaction.guild.id}`, channel.id);
            }
        }

        return interaction.reply({
            content: `✅ **تم تحديد إعدادات اللوج بنجاح**`,
            ephemeral: true
        });
    }
};
