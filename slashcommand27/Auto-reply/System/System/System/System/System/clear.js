const { 
    PermissionsBitField,
    SlashCommandBuilder,
} = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("حذف عدد من الرسائل")
        .addIntegerOption(option =>
            option
                .setName("number")
                .setDescription("عدد الرسائل")
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            // تحقق من الصلاحيات
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.reply({ content: `**لا تمتلك صلاحية لفعل ذلك**`, ephemeral: true });
            }

            let number = interaction.options.getInteger("number");

            if (number < 1) {
                return interaction.reply({ content: `**يجب أن تحذف على الأقل رسالة واحدة**`, ephemeral: true });
            }

            if (number > 100) {
                return interaction.reply({ content: `**لا يمكنك حذف أكثر من _100_ رسالة**`, ephemeral: true });
            }

            await interaction.reply({ content: `⏳ جاري حذف الرسائل...`, ephemeral: true });

            const deleted = await interaction.channel.bulkDelete(number, true).catch(() => null);

            if (!deleted) {
                return interaction.editReply({ content: `**لا أستطيع حذف الرسائل الأقدم من 14 يوم**` });
            }

            await interaction.editReply({ content: `**\`\`\`${deleted.size} رسالة تم حذفها بنجاح\`\`\`**` });

            setTimeout(() => {
                interaction.deleteReply().catch(() => null);
            }, 2000);

        } catch (error) {
            console.error("🔴 | Error in clear command:", error);
            if (!interaction.replied) {
                interaction.reply({ content: `لقد حدث خطأ، اتصل بالمطورين`, ephemeral: true });
            } else {
                interaction.editReply({ content: `لقد حدث خطأ، اتصل بالمطورين` });
            }
        }
    }
};
