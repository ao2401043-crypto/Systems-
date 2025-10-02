const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("رؤية معلومات حسابك او شخص اخر")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("الشخص")
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 1024 }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })
            })
            .addFields(
                {
                    name: `**📆 Joined Discord:**`,
                    value: `**<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>**`,
                    inline: true
                },
                member
                    ? {
                          name: `**👥 Joined Server:**`,
                          value: `**<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>**`,
                          inline: true
                      }
                    : {
                          name: `**👥 Joined Server:**`,
                          value: `❌ ليس عضوًا في السيرفر`,
                          inline: true
                      }
            )
            .setColor("Random");

        return interaction.editReply({ embeds: [embed] });
    }
};
