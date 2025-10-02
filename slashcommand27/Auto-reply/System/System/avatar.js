const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('رؤية افاتارك أو أفاتار شخص آخر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('الشخص')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        let user = interaction.options.getUser('user') || interaction.user;

        const avatarURL = user.displayAvatarURL({ size: 1024, dynamic: true });

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: avatarURL })
            .setTitle(`Avatar Link`)
            .setURL(avatarURL)
            .setImage(avatarURL)
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        return interaction.editReply({ embeds: [embed] });
    }
};
