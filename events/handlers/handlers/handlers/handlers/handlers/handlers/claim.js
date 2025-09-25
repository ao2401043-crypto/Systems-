const { 
    StringSelectMenuOptionBuilder, 
    StringSelectMenuBuilder, 
    Events, 
    EmbedBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ButtonBuilder 
} = require("discord.js");
const { Database } = require("st.db");
const dd = new Database("/Json-db/Bots/ticketDB");

const select = new StringSelectMenuBuilder()
    .setCustomId("supportPanel")
    .setPlaceholder("لوحة تحكم السبورت")
    .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("تغيير اسم التكت").setValue("renameTicket").setEmoji("✍🏼"),
        new StringSelectMenuOptionBuilder().setLabel("اضافة عضو للتذكرة").setValue("addMemberToTicket").setEmoji("✅"),
        new StringSelectMenuOptionBuilder().setLabel("حذف عضو من التذكرة").setValue("removeMemberFromTicket").setEmoji("⛔"),
        new StringSelectMenuOptionBuilder().setLabel("اعادة تحميل").setValue("refreshSupportPanel").setEmoji("🔄")
    );

const Row2 = new ActionRowBuilder().addComponents(select);

module.exports = (client7) => {
    client7.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isButton()) return;

        const [action] = interaction.customId.split("_");

        if (action === "claim") {
            const panelData = dd.get(`TICKET-PANEL_${interaction.channel.id}`);
            if (!panelData || !panelData.Support) {
                return interaction.reply({ content: "⚠️ لم يتم إعداد السبورت لهذا التكت", ephemeral: true });
            }

            const Support = panelData.Support;

            if (!interaction.member.roles.cache.has(Support)) {
                return interaction.reply({ content: "❌ فقط السبورت يمكنهم استلام التذكرة", ephemeral: true });
            }

            dd.set(`Claimed_${interaction.channel.id}`, interaction.user.id);

            const Row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Close").setCustomId("close"),
                new ButtonBuilder().setCustomId("claimed").setStyle(ButtonStyle.Success).setDisabled().setEmoji("✅").setLabel(`by ${interaction.user.username}`),
                new ButtonBuilder().setCustomId("unclaim").setStyle(ButtonStyle.Primary).setLabel("UnClaimed")
            );

            const claimembed = new EmbedBuilder()
                .setDescription(`**${interaction.user} قام بإستلام التذكرة**`)
                .setColor("Blue");

            await interaction.channel.permissionOverwrites.edit(Support, { SendMessages: false });
            await interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: true });

            await interaction.deferUpdate();
            await interaction.message.edit({ components: [Row, Row2] });
            await interaction.channel.send({ embeds: [claimembed] });

        } else if (action === "unclaim") {
            const claimedUser = dd.get(`Claimed_${interaction.channel.id}`);
            if (claimedUser !== interaction.user.id) {
                return interaction.reply({ content: "❌ التذكرة ليست لك", ephemeral: true });
            }

            const panelData = dd.get(`TICKET-PANEL_${interaction.channel.id}`);
            if (!panelData || !panelData.Support) {
                return interaction.reply({ content: "⚠️ لم يتم إعداد السبورت لهذا التكت", ephemeral: true });
            }

            const Support = panelData.Support;

            if (!interaction.member.roles.cache.has(Support)) {
                return interaction.reply({ content: "❌ فقط السبورت يمكنهم إلغاء الاستلام", ephemeral: true });
            }

            await interaction.channel.permissionOverwrites.edit(Support, { SendMessages: true });
            await interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: false });

            const unclaimembed = new EmbedBuilder()
                .setDescription(`**${interaction.user} ألغى استلام التذكرة**`)
                .setColor("Blue");

            const Row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Close").setCustomId("close"),
                new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Claim").setCustomId("claim")
            );

            await interaction.deferUpdate();
            await interaction.message.edit({ components: [Row, Row2] });
            await interaction.channel.send({ embeds: [unclaimembed] });
        }
    });
};
