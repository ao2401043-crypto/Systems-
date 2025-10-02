const { ChatInputCommandInteraction, Client, PermissionsBitField, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('اعطاء بان لشخص أو ازالته')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('الشخص')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('السبب')
                .setRequired(false)),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.reply({ content: `**❌ | لا تمتلك صلاحية لفعل ذلك**`, ephemeral: true });
            }

            const user = interaction.options.getUser('member');
            const member = interaction.options.getMember('member');
            const inputReason = interaction.options.getString('reason');
            const reason = inputReason ? `${inputReason} | By: ${interaction.user.tag}` : `By: ${interaction.user.tag}`;

            const banList = await interaction.guild.bans.fetch();
            const bannedUser = banList.get(user.id);

            if (!bannedUser) {
                if (!member) {
                    return interaction.reply({ content: `**⚠️ | لم أجد هذا العضو في السيرفر**`, ephemeral: true });
                }

                await member.ban({ reason }).catch(() => {
                    return interaction.reply({ content: `**❌ | تحقق من صلاحياتي ثم أعد المحاولة**`, ephemeral: true });
                });

                return interaction.reply({ content: `✅ | **تم اعطاء البان الى ${user.tag} بنجاح**` });
            } else {
                await interaction.guild.members.unban(user.id).catch(() => {
                    return interaction.reply({ content: `**❌ | تحقق من صلاحياتي ثم أعد المحاولة**`, ephemeral: true });
                });

                return interaction.reply({ content: `✅ | **تم ازالة البان عن ${user.tag} بنجاح**` });
            }
        } catch (error) {
            console.error("⛔ خطأ في ban command:", error);
            if (!interaction.replied) {
                return interaction.reply({ content: `⚠️ | لقد حدث خطأ غير متوقع`, ephemeral: true });
            }
        }
    }
};
