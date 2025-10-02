const { 
    ChatInputCommandInteraction, 
    Client, 
    SlashCommandBuilder, 
    PermissionsBitField 
} = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("come")
        .setDescription("استدعاء شخص")
        .addUserOption(option => 
            option
                .setName("user")
                .setDescription("الشخص المراد استدعائه")
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            // تحقق من الصلاحية
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.reply({ content: `**لا تمتلك صلاحية لفعل ذلك**`, ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: false });

            const user = interaction.options.getUser("user");

            user.send({
                content: `**📩 تم استدعاؤك بواسطة: ${interaction.user.tag}\n📍 في الروم: ${interaction.channel}**`
            }).then(() => {
                return interaction.editReply({ content: `✅ **تم إرسال الاستدعاء للشخص بنجاح**` });
            }).catch(() => {
                return interaction.editReply({ content: `❌ **لم أستطع إرسال رسالة خاصة للشخص (قد يكون قافل الخاص)**` });
            });

        } catch (error) {
            console.error("🔴 | Error in come command:", error);
            return interaction.editReply({ content: `❌ **حدث خطأ أثناء التنفيذ**` });
        }
    }
};
