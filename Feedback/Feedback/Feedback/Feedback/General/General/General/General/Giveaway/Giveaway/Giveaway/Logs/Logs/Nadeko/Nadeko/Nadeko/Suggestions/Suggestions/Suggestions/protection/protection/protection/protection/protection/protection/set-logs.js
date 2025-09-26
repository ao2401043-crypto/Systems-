const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/protectDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-protect-logs')
        .setDescription('لتحديد روم لوج الحماية')
        .addChannelOption(option =>
            option
                .setName('room')
                .setDescription('اختر روم لوج (نصي فقط)')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        try {
            const room = interaction.options.getChannel("room");

            await db.set(`protectLog_room_${interaction.guild.id}`, room.id);

            return interaction.editReply({
                content: `✅ **تم تحديد روم اللوج بنجاح:** ${room}`
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: "⚠️ حدث خطأ أثناء تحديد روم اللوج." });
        }
    }
};
