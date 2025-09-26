const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db");
const giveawayDB = new Database("/Json-db/Bots/giveawayDB.json");
const ms = require("ms");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("gstart")
        .setDescription("بدء جيف أواي")
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("المدة (مثال: 1h, 30m, 2d)")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("winners")
                .setDescription("عدد الفائزين")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("prize")
                .setDescription("الجائزة")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const duration = interaction.options.getString("duration");
        const winners = interaction.options.getInteger("winners");
        const prize = interaction.options.getString("prize");

        // تحقق من الوقت
        const durationMs = ms(duration);
        if (!durationMs || durationMs <= 0) {
            return interaction.editReply({ content: "❌ الرجاء تحديد وقت صحيح مثل: `1h`, `30m`, `2d`" });
        }

        const endTimestamp = Date.now() + durationMs;
        const endUnix = Math.floor(endTimestamp / 1000);

        const embed = new EmbedBuilder()
            .setTitle(`🎉 ${prize}`)
            .setDescription(
                `⏰ ينتهي: <t:${endUnix}:R> (<t:${endUnix}:f>)\n` +
                `👤 المستضيف: ${interaction.user}\n` +
                `🎟️ عدد المشتركين: **0**\n` +
                `🏆 عدد الفائزين: **${winners}**`
            )
            .setColor("#5865F2")
            .setTimestamp(endTimestamp);

        const button = new ButtonBuilder()
            .setCustomId("join_giveaway")
            .setEmoji("🎉")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.editReply({ content: "✅ تم إنشاء الجيف أواي بنجاح" });

        let giveaways = giveawayDB.get(`giveaways_${interaction.guild.id}`) || [];

        const giveawayMessage = await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });

        giveaways.push({
            messageid: giveawayMessage.id,
            channelid: interaction.channel.id,
            entries: [],
            winners: winners,
            prize: prize,
            duration: durationMs / 1000,
            dir1: endUnix,
            dir2: endTimestamp,
            host: interaction.user.id,
            ended: false
        });

        await giveawayDB.set(`giveaways_${interaction.guild.id}`, giveaways);
    }
};
