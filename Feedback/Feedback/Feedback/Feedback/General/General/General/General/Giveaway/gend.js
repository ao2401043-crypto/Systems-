const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const giveawayDB = new Database("/Json-db/Bots/giveawayDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("gend")
        .setDescription("انهاء جيف أواي")
        .addStringOption(option =>
            option
                .setName("giveawayid")
                .setDescription("ايدي رسالة الجيف أواي")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const giveawayid = interaction.options.getString("giveawayid");
        let giveaways = giveawayDB.get(`giveaways_${interaction.guild.id}`) || [];

        // البحث عن الجيف أواي
        const giveawayFind = giveaways.find(gu => gu.messageid === giveawayid);
        if (!giveawayFind) {
            return interaction.editReply({
                content: "❌ لم يتم العثور على جيف أواي بهذا الايدي",
                ephemeral: true
            });
        }

        // التأكد إذا كان منتهي
        if (giveawayFind.ended === true) {
            return interaction.editReply({
                content: "⚠️ هذا الجيف أواي انتهى بالفعل",
                ephemeral: true
            });
        }

        // تحديث الحالة
        giveawayFind.duration = 0;
        giveawayFind.ended = true;
        giveawayDB.set(`giveaways_${interaction.guild.id}`, giveaways);

        // محاولة جلب الرسالة للتأكد
        try {
            const channel = await interaction.guild.channels.fetch(giveawayFind.channelid);
            if (channel) {
                await channel.messages.fetch(giveawayid).catch(() => null);
            }
        } catch (err) {
            console.error("خطأ في جلب رسالة الجيف أواي:", err);
        }

        return interaction.editReply({
            content: "✅ تم انهاء هذا الجيف أواي بنجاح"
        });
    }
};
