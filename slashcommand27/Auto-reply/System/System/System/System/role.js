const { 
    Client, 
    SlashCommandBuilder, 
    PermissionsBitField 
} = require("discord.js");

const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("اعطاء رتبة لشخص او ازالتها")
        .addUserOption(option => 
            option
                .setName("member")
                .setDescription("الشخص")
                .setRequired(true)
        )
        .addRoleOption(option => 
            option
                .setName("role")
                .setDescription("الرتبة")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("give_or_remove")
                .setDescription("الاعطاء ام السحب")
                .setRequired(true)
                .addChoices(
                    { name: "Give", value: "Give" },
                    { name: "Remove", value: "Remove" }
                )
        ),

    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                return interaction.reply({ content: "**❌ لا تمتلك صلاحية لفعل ذلك**", ephemeral: true });
            }

            const member = interaction.options.getMember("member");
            const role = interaction.options.getRole("role");
            const give_or_remove = interaction.options.getString("give_or_remove");

            if (!member) return interaction.reply({ content: "⚠️ **لم أتمكن من العثور على العضو**", ephemeral: true });
            if (!role) return interaction.reply({ content: "⚠️ **لم أتمكن من العثور على الرتبة**", ephemeral: true });

            if (give_or_remove === "Give") {
                await member.roles.add(role).catch(() => {
                    return interaction.reply({ content: "⚠️ **تحقق من صلاحياتي ثم أعد المحاولة**", ephemeral: true });
                });
                return interaction.reply({ content: `✅ **تم اعطاء الرتبة ${role} إلى ${member} بنجاح**` });
            }

            if (give_or_remove === "Remove") {
                if (!member.roles.cache.has(role.id)) {
                    return interaction.reply({ content: "⚠️ **هذا الشخص لا يمتلك هذه الرتبة لإزالتها**", ephemeral: true });
                }

                await member.roles.remove(role).catch(() => {
                    return interaction.reply({ content: "⚠️ **تحقق من صلاحياتي ثم أعد المحاولة**", ephemeral: true });
                });
                return interaction.reply({ content: `✅ **تم ازالة الرتبة ${role} من ${member} بنجاح**` });
            }
        } catch (error) {
            console.log("🔴 | Error in role command:", error);
            return interaction.reply({ content: "❌ **لقد حدث خطأ، اتصل بالمطورين**", ephemeral: true });
        }
    }
};
