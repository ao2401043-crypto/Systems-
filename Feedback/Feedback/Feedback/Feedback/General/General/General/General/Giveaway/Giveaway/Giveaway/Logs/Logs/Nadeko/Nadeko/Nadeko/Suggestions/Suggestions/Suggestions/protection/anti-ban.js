const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/protectDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName("anti-ban")
        .setDescription("تسطيب نظام الحماية من الباند")
        .addStringOption(option => 
            option
                .setName("status")
                .setDescription("الحالة")
                .setRequired(true)
                .addChoices(
                    { name: "On", value: "on" },
                    { name: "Off", value: "off" }
                )
        )
        .addIntegerOption(option =>
            option
                .setName("limit")
                .setDescription("العدد المسموح في اليوم")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        try {
            const status = interaction.options.getString("status");
            const limit = interaction.options.getInteger("limit");

            await db.set(`ban_status_${interaction.guild.id}`, status);
            await db.set(`ban_limit_${interaction.guild.id}`, limit);
            await db.set(`ban_users_${interaction.guild.id}`, []);

            return interaction.editReply({
                content: `**✅ تم بنجاح تعيين نظام الحماية من البان**\n> تأكد من رفع رتبتي لأعلى رتبة في السيرفر.`
            });
        } catch (error) {
            console.error("❌ خطأ في anti-ban:", error);
            return interaction.editReply({
                content: `حدث خطأ أثناء تنفيذ الأمر.`
            });
        }
    }
};
