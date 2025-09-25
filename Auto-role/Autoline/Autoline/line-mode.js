const { SlashCommandBuilder } = require('discord.js');
const { Database } = require('st.db');

const autolineDB = new Database("/Json-db/Bots/autolineDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('line-mode')
        .setDescription('اختر بين إرسال صورة أو رابط')
        .addStringOption(option => 
            option.setName('mode')
                .setDescription('اختر بين الصورة والرابط')
                .setRequired(true)
                .addChoices(
                    { name: '📷 صورة', value: 'image' },
                    { name: '🔗 رابط', value: 'link' },
                )),
                
    async execute(interaction) {
        const mode = interaction.options.getString('mode');

        if (!mode) {
            return interaction.reply({ content: "❌ يرجى اختيار وضع صحيح (صورة أو رابط)", ephemeral: true });
        }

        await autolineDB.set(`line_mode_${interaction.guild.id}`, mode);

        const modeText = mode === "image" ? "📷 صورة" : "🔗 رابط";
        await interaction.reply({ content: `✅ تم ضبط وضع الإرسال إلى **${modeText}**`, ephemeral: true });
    },
};
