const { 
    SlashCommandBuilder, 
    PermissionsBitField 
} = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("🔒 قفل الروم ومنع الجميع من الكتابة"),

    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply({ 
                    content: "❌ **لا تمتلك صلاحية لفعل ذلك**", 
                    ephemeral: true 
                });
            }

            await interaction.deferReply({ ephemeral: false });

            const everyoneRole = interaction.guild.roles.everyone;
            const channel = interaction.channel;

            // تحقق إذا الروم مقفول أصلاً
            const currentPerms = channel.permissionOverwrites.cache.get(everyoneRole.id);
            if (currentPerms && currentPerms.deny.has(PermissionsBitField.Flags.SendMessages)) {
                return interaction.editReply({ 
                    content: `⚠️ **${channel} مقفول بالفعل**` 
                });
            }

            await channel.permissionOverwrites.edit(everyoneRole, { SendMessages: false });

            return interaction.editReply({ 
                content: `✅ **تم قفل ${channel} ومنع الجميع من الكتابة**` 
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply({ 
                content: "⚠️ **حدث خطأ غير متوقع، اتصل بالمطورين**" 
            });
        }
    }
};
