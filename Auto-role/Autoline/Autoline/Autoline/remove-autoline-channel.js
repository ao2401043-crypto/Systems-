const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");

const autolineDB = new Database("/Json-db/Bots/autolineDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('remove-autoline-channel')
        .setDescription('ازالة روم خط تلقائي')
        .addChannelOption(option => 
            option
                .setName('room')
                .setDescription('الروم')
                .setRequired(true)
        ),

    async execute(interaction) {
        const room = interaction.options.getChannel('room');
        const key = `line_channels_${interaction.guild.id}`;

        // لو ما في داتا مسبقاً
        if (!autolineDB.has(key)) {
            return interaction.reply({ content: "❌ ما في أي روم مضاف من قبل.", ephemeral: true });
        }

        let db = autolineDB.get(key);

        // لو الروم مش موجود
        if (!db.includes(room.id)) {
            return interaction.reply({ content: "⚠️ هذا الروم مش موجود في قائمة الخط التلقائي.", ephemeral: true });
        }

        // حذف الروم
        const filtered = db.filter(ch => ch !== room.id);
        await autolineDB.set(key, filtered);

        return interaction.reply({ content: `✅ تم إزالة الروم <#${room.id}> بنجاح.` });
    }
};
