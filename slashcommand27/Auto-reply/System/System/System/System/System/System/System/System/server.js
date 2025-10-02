const { 
    Client, 
    Collection, 
    SlashCommandBuilder, 
    ChannelType, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder 
} = require("discord.js");

const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('رؤية معلومات السيرفر'),
        
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setAuthor({ 
                name: guild.name, 
                iconURL: guild.iconURL({ dynamic: true }) || undefined 
            })
            .setColor('Random')
            .addFields(
                {
                    name: `🆔 Server ID`, 
                    value: `${guild.id}`, 
                    inline: false
                },
                {
                    name: `📆 Created On`, 
                    value: `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`, 
                    inline: false
                },
                {
                    name: `👑 Owned By`, 
                    value: `<@${guild.ownerId}>`, 
                    inline: false
                },
                {
                    name: `👥 Members (${guild.memberCount})`, 
                    value: `✨ Boosts: **${guild.premiumSubscriptionCount}**`, 
                    inline: false
                },
                {
                    name: `💬 Channels (${guild.channels.cache.size})`, 
                    value: `**${guild.channels.cache.filter(r => r.type === ChannelType.GuildText).size}** Text | **${guild.channels.cache.filter(r => r.type === ChannelType.GuildVoice).size}** Voice | **${guild.channels.cache.filter(r => r.type === ChannelType.GuildCategory).size}** Category`, 
                    inline: false
                },
                {
                    name: '🌍 Others',
                    value: `**Verification Level:** ${guild.verificationLevel}`,
                    inline: false,
                },
            )
            .setThumbnail(guild.iconURL({ dynamic: true }) || null);

        return interaction.editReply({ embeds: [embed] });
    }
};
