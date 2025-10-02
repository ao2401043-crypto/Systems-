const { 
    Client, 
    Collection, 
    PermissionsBitField, 
    SlashCommandBuilder 
} = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("اعطاء تايم اوت لشخص او ازالته")
        .addUserOption(option =>
            option.setName("member")
                .setDescription("الشخص")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("time")
                .setDescription("الوقت بالدقائق (0 لإزالة التايم أوت)")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("السبب")
                .setRequired(false)),

    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                return interaction.reply({ 
                    content: `**❌ لا تمتلك صلاحية لفعل ذلك**`, 
                    ephemeral: true 
                });
            }

            const member = interaction.options.getMember("member");
            const time = interaction.options.getInteger("time"); // بالدقائق
            const reason = interaction.options.getString("reason") ?? "No reason";

            if (!member) {
                return interaction.reply({ content: `**❌ لم أتمكن من العثور على العضو**`, ephemeral: true });
            }

            if (time === 0) {
                // إزالة التايم أوت
                await member.timeout(null, reason).catch(() => {
                    return interaction.reply({ 
                        content: `**❌ لم أستطع إزالة التايم أوت، تحقق من صلاحياتي.**`, 
                        ephemeral: true 
                    });
                });
                return interaction.reply({ content: `✅ **تم إزالة التايم أوت من ${member.user.tag}**` });
            }

            // إعطاء تايم أوت
            await member.timeout(time * 60 * 1000, reason).catch(() => {
                return interaction.reply({ 
                    content: `**❌ لم أستطع إعطاء التايم أوت، تحقق من صلاحياتي.**`, 
                    ephemeral: true 
                });
            });

            return interaction.reply({ content: `✅ **تم إعطاء التايم أوت لـ ${member.user.tag} لمدة ${time} دقيقة**` });

        } catch (error) {
            console.error("🔴 خطأ في أمر timeout:", error);
            return interaction.reply({ content: `**حدث خطأ، تواصل مع المطور.**`, ephemeral: true });
        }
    }
};
