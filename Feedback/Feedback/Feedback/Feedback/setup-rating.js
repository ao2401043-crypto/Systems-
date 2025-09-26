const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("setup-rating")
        .setDescription("تسطيب إعدادات التقييم")
        .addRoleOption(option =>
            option
                .setName("staff-role")
                .setDescription("رتبة الإدارة")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("rank-room")
                .setDescription("الروم اللي تنرسل لها التقييمات")
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const role = interaction.options.getRole("staff-role");
            const room = interaction.options.getChannel("rank-room");

            await feedbackDB.set(`staff_role_${interaction.guild.id}`, role.id);
            await feedbackDB.set(`rank_room_${interaction.guild.id}`, room.id);

            return interaction.reply({
                content: `✅ **تم حفظ إعدادات التقييم بنجاح**\n• رتبة الإدارة: <@&${role.id}>\n• روم التقييمات: <#${room.id}>`,
                ephemeral: true
            });
        } catch (error) {
            console.error("⛔ Error setting feedback config:", error);
            return interaction.reply({
                content: "❌ حدث خطأ أثناء تحديد الإعدادات.",
                ephemeral: true
            });
        }
    }
};
