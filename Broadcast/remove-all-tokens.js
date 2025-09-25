const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/BroadcastDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('remove-all-tokens')
        .setDescription('إزالة جميع بوتات البرودكاست'),
        
    async execute(interaction) {
        try {
            const key = `tokens_${interaction.guild.id}`;
            
            if (!db.has(key)) {
                return interaction.reply({ 
                    content: '**لا يوجد توكنات مسجلة في هذا السيرفر.**', 
                    ephemeral: true 
                });
            }

            await db.delete(key);

            return interaction.reply({ 
                content: '**✅ تم إزالة جميع التوكنات من السيرفر بنجاح!**', 
                ephemeral: true 
            });

        } catch (error) {
            console.error("⛔ Error in remove-all-tokens command:", error);
            return interaction.reply({ 
                content: '**❌ حدث خطأ أثناء إزالة التوكنات.**', 
                ephemeral: true 
            });
        }
    }
};
