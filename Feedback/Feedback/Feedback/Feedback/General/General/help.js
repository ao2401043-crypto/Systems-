const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ChatInputCommandInteraction, 
    Client, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    Colors 
} = require("discord.js");  

module.exports = {  
    ownersOnly: false,  
    data: new SlashCommandBuilder()  
        .setName("help")  
        .setDescription("قائمة أوامر البوت"),  

    /**  
     * @param {ChatInputCommandInteraction} interaction  
     * @param {Client} client  
     */  
    async execute(interaction) {  
        try {  
            await interaction.deferReply({ ephemeral: false });  

            const embed = new EmbedBuilder()  
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })  
                .setTitle("قائمة أوامر البوت")  
                .setDescription("**يرجى اختيار القسم المراد معرفة أوامره**")  
                .addFields({ name: `\u200b`, value: `\`\`\`✨ | +80 أمر\`\`\`` })  
                .setTimestamp()  
                .setFooter({ text: `Requested By ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })  
                .setColor(Colors.DarkButNotBlack);  

            const btns1 = new ActionRowBuilder().addComponents(  
                new ButtonBuilder().setCustomId("help_tax").setLabel("ضريبة").setStyle(ButtonStyle.Secondary).setEmoji("💰"),  
                new ButtonBuilder().setCustomId("help_autoline").setLabel("خط تلقائي").setStyle(ButtonStyle.Secondary).setEmoji("🤖"),  
                new ButtonBuilder().setCustomId("help_suggestion").setLabel("اقتراحات").setStyle(ButtonStyle.Secondary).setEmoji("💡"),  
                new ButtonBuilder().setCustomId("help_feedback").setLabel("آراء").setStyle(ButtonStyle.Secondary).setEmoji("💭"),  
                new ButtonBuilder().setCustomId("help_system").setLabel("سيستم").setStyle(ButtonStyle.Secondary).setEmoji("⚙️")  
            );  

            const btns2 = new ActionRowBuilder().addComponents(  
                new ButtonBuilder().setCustomId("help_ticket").setLabel("تكت").setStyle(ButtonStyle.Secondary).setEmoji("🎫"),  
                new ButtonBuilder().setCustomId("help_giveaway").setLabel("جيف أوي").setStyle(ButtonStyle.Secondary).setEmoji("🎁"),  
                new ButtonBuilder().setCustomId("help_protection").setLabel("حماية").setStyle(ButtonStyle.Secondary).setEmoji("🛡️"),  
                new ButtonBuilder().setCustomId("help_logs").setLabel("لوج").setStyle(ButtonStyle.Secondary).setEmoji("📜"),  
                new ButtonBuilder().setCustomId("help_apply").setLabel("تقديمات").setStyle(ButtonStyle.Secondary).setEmoji("📝")  
            );  

            const btns3 = new ActionRowBuilder().addComponents(  
                new ButtonBuilder().setCustomId("help_broadcast").setLabel("برودكاست").setStyle(ButtonStyle.Secondary).setEmoji("📢"),  
                new ButtonBuilder().setCustomId("help_nadeko").setLabel("ناديكو").setStyle(ButtonStyle.Secondary).setEmoji("⏳"),  
                new ButtonBuilder().setCustomId("help_autoreply").setLabel("رد تلقائي").setStyle(ButtonStyle.Secondary).setEmoji("💎"),  
                new ButtonBuilder().setCustomId("help_autorole").setLabel("رتب تلقائية").setStyle(ButtonStyle.Secondary).setEmoji("⚡")  
            );  

            await interaction.editReply({  
                embeds: [embed],  
                components: [btns1, btns2, btns3]  
            });  
        } catch (error) {  
            console.log("🔴 | Error in help all in one bot", error);  
        }  
    }  
};
