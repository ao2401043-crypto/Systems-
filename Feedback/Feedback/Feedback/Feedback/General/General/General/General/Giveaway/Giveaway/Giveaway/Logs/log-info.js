const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/logsDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName("logs-info")
        .setDescription("معلومات نظام اللوج في السيرفر"),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        await interaction.deferReply();

        // الرسائل
        const messagedelete = await db.get(`log_messagedelete_${interaction.guild.id}`);
        const messageupdate = await db.get(`log_messageupdate_${interaction.guild.id}`);
        // الرتب
        const rolecreate = await db.get(`log_rolecreate_${interaction.guild.id}`);
        const roledelete = await db.get(`log_roledelete_${interaction.guild.id}`);
        const rolegive = await db.get(`log_rolegive_${interaction.guild.id}`);
        const roleremove = await db.get(`log_roleremove_${interaction.guild.id}`);
        // القنوات
        const channelcreate = await db.get(`log_channelcreate_${interaction.guild.id}`);
        const channeldelete = await db.get(`log_channeldelete_${interaction.guild.id}`);
        // البوتات
        const botadd = await db.get(`log_botadd_${interaction.guild.id}`);
        // الباند والطرد
        const banadd = await db.get(`log_banadd_${interaction.guild.id}`);
        const bandelete = await db.get(`log_bandelete_${interaction.guild.id}`);
        const kickadd = await db.get(`log_kickadd_${interaction.guild.id}`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setTitle("📑 معلومات نظام اللوج")
            .addFields(
                { name: "📝 حذف رسالة", value: messagedelete ? `<#${messagedelete}>` : "```غير محددة```", inline: true },
                { name: "✏️ تحديث رسالة", value: messageupdate ? `<#${messageupdate}>` : "```غير محددة```", inline: true },
                { name: "\u200B", value: "\u200B", inline: false },

                { name: "➕ إنشاء رتبة", value: rolecreate ? `<#${rolecreate}>` : "```غير محددة```", inline: true },
                { name: "➖ حذف رتبة", value: roledelete ? `<#${roledelete}>` : "```غير محددة```", inline: true },
                { name: "✅ إعطاء رتبة", value: rolegive ? `<#${rolegive}>` : "```غير محددة```", inline: true },
                { name: "❌ إزالة رتبة", value: roleremove ? `<#${roleremove}>` : "```غير محددة```", inline: true },
                { name: "\u200B", value: "\u200B", inline: false },

                { name: "📂 إنشاء قناة", value: channelcreate ? `<#${channelcreate}>` : "```غير محددة```", inline: true },
                { name: "🗑️ حذف قناة", value: channeldelete ? `<#${channeldelete}>` : "```غير محددة```", inline: true },
                { name: "\u200B", value: "\u200B", inline: false },

                { name: "🤖 إضافة بوت", value: botadd ? `<#${botadd}>` : "```غير محددة```", inline: true },
                { name: "\u200B", value: "\u200B", inline: false },

                { name: "🔨 إضافة باند", value: banadd ? `<#${banadd}>` : "```غير محددة```", inline: true },
                { name: "⚖️ حذف باند", value: bandelete ? `<#${bandelete}>` : "```غير محددة```", inline: true },
                { name: "👢 طرد", value: kickadd ? `<#${kickadd}>` : "```غير محددة```", inline: true }
            )
            .setColor("Random")
            .setTimestamp()
            .setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.editReply({ embeds: [embed] });
    }
};
