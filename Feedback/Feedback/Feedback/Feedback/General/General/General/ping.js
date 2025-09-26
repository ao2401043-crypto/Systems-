const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    Colors 
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("لتجربة سرعة البوت"),
    
    async execute(interaction, client) {
        const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });

        const ping = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setTitle(`**🏓 | My Ping: \`${ping}\`ms**`)
            .setColor(Colors.DarkButNotBlack)
            .setAuthor({ 
                name: interaction.guild.name, 
                iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })
            .setFooter({ 
                text: interaction.user.username, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        return interaction.editReply({ content: "", embeds: [embed] });
    }
};
