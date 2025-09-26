const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/protectDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('anti-delete-rooms')
        .setDescription('تسطيب نظام الحماية من حذف الرومات')
        .addStringOption(option =>
            option
                .setName('status')
                .setDescription('الحالة')
                .setRequired(true)
                .addChoices(
                    { name: 'On', value: 'on' },
                    { name: 'Off', value: 'off' }
                )
        )
        .addIntegerOption(option =>
            option
                .setName('limit')
                .setDescription('العدد المسموح في اليوم')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        try {
            const status = interaction.options.getString('status');
            const limit = interaction.options.getInteger('limit');

            await db.set(`antideleterooms_status_${interaction.guild.id}`, status);
            await db.set(`antideleterooms_limit_${interaction.guild.id}`, limit);
            await db.set(`roomsdelete_users_${interaction.guild.id}`, []);

            return interaction.editReply({
                content: `**تم بنجاح تعيين نظام الحماية من حذف الرومات \n - تأكد من رفع رتبتي لأعلى رتبة في السيرفر**`
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply({
                content: `⚠️ حدث خطأ أثناء تنفيذ الأمر.`
            });
        }
    }
};
