const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/BroadcastDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('remove-token')
        .setDescription('إزالة توكن برودكاست')
        .addStringOption(option =>
            option
                .setName('token')
                .setDescription('التوكن')
                .setRequired(true)),
                
    async execute(interaction) {
        try {
            const token = interaction.options.getString('token');
            const key = `tokens_${interaction.guild.id}`;
            const tokens = db.get(key) || [];

            if (!tokens.includes(token)) {
                return interaction.reply({ 
                    content: '**❌ هذا التوكن غير موجود في السيرفر.**',
                    ephemeral: true 
                });
            }

            const updated = tokens.filter(t => t !== token);
            await db.set(key, updated);

            return interaction.reply({ 
                content: `**✅ تم إزالة التوكن بنجاح!**\nعدد التوكنات المتبقية: \`${updated.length}\``,
                ephemeral: true 
            });

        } catch (error) {
            console.error("⛔ Error in remove-token command:", error);
            return interaction.reply({ 
                content: `**❌ حدث خطأ أثناء إزالة التوكن.**`,
                ephemeral: true 
            });
        }
    }
};
