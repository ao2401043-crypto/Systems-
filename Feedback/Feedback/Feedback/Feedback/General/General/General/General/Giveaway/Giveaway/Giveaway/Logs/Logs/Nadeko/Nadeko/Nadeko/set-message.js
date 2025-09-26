const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/nadekoDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("set-message")
        .setDescription("تحديد الرسالة عند الدخول")
        .addStringOption(option =>
            option.setName("message")
                .setDescription("الرسالة")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getString("message");
        await db.set(`message_${interaction.guild.id}`, message);

        return interaction.editReply({ content: `✅ **تم تحديد الرسالة بنجاح:**\n${message}` });
    }
};
