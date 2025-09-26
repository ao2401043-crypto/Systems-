const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const giveawayDB = new Database("/Json-db/Bots/giveawayDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("greroll")
        .setDescription("إعادة اختيار فائزين لجيف أواي")
        .addStringOption(option =>
            option
                .setName("giveawayid")
                .setDescription("ايدي رسالة الجيف أواي")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const giveawayid = interaction.options.getString("giveawayid");
        const guild = interaction.guild;

        let giveaways = giveawayDB.get(`giveaways_${guild.id}`) || [];
        const giveawayFind = giveaways.find(gu => gu.messageid === giveawayid);

        if (!giveawayFind) {
            return interaction.editReply({ content: "❌ لم يتم العثور على جيف أواي بهذا الايدي" });
        }

        let { messageid, channelid, entries, winners, prize, ended } = giveawayFind;

        if (!ended) {
            return interaction.editReply({ content: "⚠️ هذا الجيف أواي لم ينتهي بعد" });
        }

        const channel = guild.channels.cache.get(channelid);
        if (!channel) {
            return interaction.editReply({ content: "❌ لم يتم العثور على القناة الخاصة بالجيف أواي" });
        }

        let themsg;
        try {
            themsg = await channel.messages.fetch(messageid);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: "❌ لم أتمكن من العثور على رسالة الجيف أواي" });
        }

        if (entries.length === 0) {
            return interaction.editReply({ content: "⚠️ لا يوجد أي مشتركين في هذا الجيف أواي" });
        }

        if (entries.length < winners) winners = entries.length; // نضبط عدد الفائزين حسب المشتركين

        const pool = [...entries]; // نسخة من المشتركين
        const theWinners = [];

        for (let i = 0; i < winners; i++) {
            const winnerIndex = Math.floor(Math.random() * pool.length);
            const winner = pool.splice(winnerIndex, 1)[0];
            theWinners.push(`<@${winner}>`);
        }

        await themsg.reply({
            content: `🎉 Congratulations ${theWinners.join(", ")}! You won the **${prize}**!`
        });

        return interaction.editReply({ content: "✅ تم إعادة اختيار الفائزين بنجاح" });
    }
};
