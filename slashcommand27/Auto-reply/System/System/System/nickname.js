const { 
    ChatInputCommandInteraction, 
    Client, 
    SlashCommandBuilder, 
    PermissionsBitField 
} = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("nickname")
        .setDescription("اعطاء اسم مستعار لشخص او ازالته")
        .addUserOption(option => 
            option
                .setName("user")
                .setDescription("الشخص")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("nickname")
                .setDescription("الاسم المستعار")
                .setRequired(false)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ ephemeral: false });

            const user = interaction.options.getUser("user");
            const member = interaction.options.getMember("user");
            const nickname = interaction.options.getString("nickname");

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                return interaction.editReply({ content: "❌ **لا تمتلك صلاحية لفعل ذلك**" });
            }

            if (!member) {
                return interaction.editReply({ content: "⚠️ **لم اعثر على العضو**" });
            }

            if (nickname) {
                await member.setNickname(nickname)
                    .then(() => {
                        return interaction.editReply({ 
                            content: `✅ **تم تعيين الاسم المستعار ل __${user.username}__**` 
                        });
                    })
                    .catch((error) => {
                        console.log("🔴 | Error in nickname command:", error);
                        return interaction.editReply({ content: "⚠️ **لا امتلك صلاحية لتغيير لقب هذا العضو**" });
                    });
            } else {
                await member.setNickname(null) // إرجاع الاسم الأصلي
                    .then(() => {
                        return interaction.editReply({ 
                            content: `✅ **تم اعادة الاسم الأصلي ل __${user.username}__**` 
                        });
                    })
                    .catch((error) => {
                        console.log("🔴 | Error in nickname command:", error);
                        return interaction.editReply({ content: "⚠️ **لا امتلك صلاحية لإزالة اللقب من هذا العضو**" });
                    });
            }
        } catch (error) {
            console.log("🔴 | Error in nickname command:", error);
            return interaction.editReply({ content: "❌ **لقد حدث خطأ، اتصل بالمطورين**" });
        }
    }
};
