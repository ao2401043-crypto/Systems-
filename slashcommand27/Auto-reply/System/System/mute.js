const { 
    SlashCommandBuilder, 
    PermissionsBitField, 
    ChannelType 
} = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("اعطاء ميوت لشخص او ازالته")
        .addUserOption(option => 
            option
                .setName("member")
                .setDescription("الشخص")
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
                return interaction.reply({ 
                    content: "❌ **لا تمتلك صلاحية لفعل ذلك**", 
                    ephemeral: true 
                });
            }

            await interaction.deferReply({ ephemeral: false });

            const member = interaction.options.getMember("member");
            const action = interaction.options.getString("give_or_remove");

            // البحث عن رول "Muted" أو إنشاؤه
            let role = interaction.guild.roles.cache.find(r => r.name === "Muted");

            if (!role) {
                role = await interaction.guild.roles.create({
                    name: "Muted",
                    permissions: []
                });

                // تعديل صلاحيات كل الرومات النصية
                interaction.guild.channels.cache
                    .filter(c => c.type === ChannelType.GuildText)
                    .forEach(c => {
                        c.permissionOverwrites.edit(role, { SendMessages: false });
                    });
            }

            // تنفيذ الأمر
            if (action === "Give") {
                await member.roles.add(role).catch(() => {
                    return interaction.editReply({ 
                        content: "⚠️ **الرجاء التحقق من صلاحياتي ثم اعادة المحاولة**" 
                    });
                });

                return interaction.editReply({ 
                    content: `✅ **تم اعطاء الميوت الى ${member} بنجاح**` 
                });
            }

            if (action === "Remove") {
                if (!member.roles.cache.has(role.id)) {
                    return interaction.editReply({ 
                        content: "⚠️ **هذا الشخص لا يمتلك ميوت للازالة منه**" 
                    });
                }

                await member.roles.remove(role).catch(() => {
                    return interaction.editReply({ 
                        content: "⚠️ **الرجاء التحقق من صلاحياتي ثم اعادة المحاولة**" 
                    });
                });

                return interaction.editReply({ 
                    content: `✅ **تم ازالة الميوت من ${member} بنجاح**` 
                });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply({ 
                content: "❌ **لقد حدث خطأ، اتصل بالمطورين**" 
            });
        }
    }
};
