const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const suggestionsDB = new Database("/Json-db/Bots/suggestionsDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("set-suggestions-room")
        .setDescription("تحديد روم الاقتراحات")
        .addChannelOption(option =>
            option
                .setName("room")
                .setDescription("الروم")
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const room = interaction.options.getChannel("room");

            await suggestionsDB.set(`suggestions_room_${interaction.guild.id}`, room.id);

            return interaction.reply({
                content: `✅ **تم تحديد روم الاقتراحات بنجاح**: ${room}`,
                ephemeral: true
            });
        } catch (error) {
            console.error("⛔ | Error in set-suggestions-room command:", error);
            return interaction.reply({
                content: "⚠️ حدث خطأ أثناء محاولة تحديد الروم.",
                ephemeral: true
            });
        }
    }
};
