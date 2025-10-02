const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("فتح الروم"),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({
                content: `**لا تمتلك صلاحية لفعل ذلك**`,
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: false });

        await interaction.channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            { SendMessages: true }
        );

        return interaction.editReply({
            content: `**${interaction.channel} has been unlocked 🔓**`
        });
    }
};
