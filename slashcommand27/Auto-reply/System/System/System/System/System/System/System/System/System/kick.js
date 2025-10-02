const { 
    SlashCommandBuilder, 
    PermissionsBitField 
} = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("طرد عضو من السيرفر")
        .addUserOption(option =>
            option.setName("member")
                .setDescription("الشخص المراد طرده")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("سبب الطرد")
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                return interaction.reply({ content: "❌ **لا تمتلك صلاحية لفعل ذلك**", ephemeral: true });
            }

            const member = interaction.options.getMember("member");
            const reason = interaction.options.getString("reason") 
                ? `${interaction.options.getString("reason")} | By: ${interaction.user.tag}`
                : `By: ${interaction.user.tag}`;

            if (!member) {
                return interaction.reply({ content: "❌ **لم أستطع العثور على العضو**", ephemeral: true });
            }

            if (!member.kickable) {
                return interaction.reply({ content: "❌ **لا أستطيع طرد هذا العضو (رتبته أعلى مني)**", ephemeral: true });
            }

            await member.kick(reason);

            return interaction.reply({ content: `✅ **تم طرد ${member.user.tag} بنجاح**\n📌 السبب: ${reason}` });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "⚠️ **حدث خطأ غير متوقع، اتصل بالمطورين**", ephemeral: true });
        }
    }
};
