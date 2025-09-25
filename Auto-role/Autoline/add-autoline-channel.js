const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");

const autolineDB = new Database("/Json-db/Bots/autolineDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('add-autoline-channel')
        .setDescription('اضافة روم خط تلقائي')
        .addChannelOption(option =>
            option
                .setName('room')
                .setDescription('الروم')
                .setRequired(true)
        ),

    async execute(interaction) {
        const room = interaction.options.getChannel('room');

        if (!room) {
            return interaction.reply({ content: "❌ لم يتم العثور على الروم!", ephemeral: true });
        }

        if (!autolineDB.has(`line_channels_${interaction.guild.id}`)) {
            await autolineDB.set(`line_channels_${interaction.guild.id}`, []);
        }

        await autolineDB.push(`line_channels_${interaction.guild.id}`, room.id);

        return interaction.reply({ content: `✅ **تم اضافة الروم ${room} بنجاح**`, ephemeral: true });
    }
};
