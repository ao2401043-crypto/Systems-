const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/ticketDB");
const {
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  Events,
  ModalBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonStyle,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    // أزرار أو منيو
    if (
      (interaction.isButton() || interaction.isStringSelectMenu()) &&
      interaction.customId.startsWith("ticket")
    ) {
      const customId = interaction.isStringSelectMenu()
        ? interaction.values[0]
        : interaction.customId;

      if (customId === "reset") return;

      const data = db.get(`Ticket_${interaction.guild.id}_${customId}`);
      if (!data)
        return interaction.reply({
          content: `⚠️ الرجاء إعادة ضبط النظام`,
          ephemeral: true,
        });

      if (data.Ask === "on") {
        const modal = new ModalBuilder()
          .setCustomId(customId + "_modal")
          .setTitle("سبب فتح التذكرة")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("ticket_reason")
                .setLabel("ما هو سبب فتح التكت")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
        await interaction.showModal(modal);
      } else {
        createTicketChannel(interaction, data);
      }
    }

    // استلام بيانات المودال
    if (interaction.isModalSubmit() && interaction.customId.endsWith("_modal")) {
      const buttonCustomId = interaction.customId.replace("_modal", "");
      const data = db.get(`Ticket_${interaction.guild.id}_${buttonCustomId}`);
      if (!data)
        return interaction.reply({
          content: `⚠️ الرجاء إعادة ضبط النظام`,
          ephemeral: true,
        });

      const ticketReason = interaction.fields.getTextInputValue("ticket_reason");
      createTicketChannel(interaction, data, ticketReason);
    }
  });
};

async function createTicketChannel(interaction, data, ticketReason = null) {
  try {
    const name = `ticket-${interaction.user.username.slice(0, 20)}`;

    const channel = await interaction.guild.channels.create({
      name,
      type: 0,
      parent: data.Category,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: ["ViewChannel"],
        },
        {
          id: data.Support,
          allow: ["ViewChannel", "SendMessages"],
        },
        {
          id: interaction.user.id,
          allow: ["ViewChannel", "SendMessages"],
        },
      ],
    });

    db.set(`TICKET-PANEL_${channel.id}`, {
      author: interaction.user.id,
      Support: data.Support,
    });

    await interaction.reply({
      content: `${channel} تم إنشاؤه ✅`,
      ephemeral: true,
    });

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`${data.Internal}`)
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setTimestamp();

    const select = new StringSelectMenuBuilder()
      .setCustomId("supportPanel")
      .setPlaceholder("لوحة تحكم السبورت")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("تغيير اسم التكت")
          .setValue("renameTicket")
          .setEmoji("✍🏼"),
        new StringSelectMenuOptionBuilder()
          .setLabel("اضافة عضو للتذكرة")
          .setValue("addMemberToTicket")
          .setEmoji("✅"),
        new StringSelectMenuOptionBuilder()
          .setLabel("حذف عضو من التذكرة")
          .setValue("removeMemberFromTicket")
          .setEmoji("⛔"),
        new StringSelectMenuOptionBuilder()
          .setLabel("اعادة تحميل")
          .setValue("refreshSupportPanel")
          .setEmoji("🔄")
      );

    const row2 = new ActionRowBuilder().addComponents(select);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close")
        .setLabel("Close")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("claim")
        .setLabel("Claim")
        .setStyle(ButtonStyle.Success)
    );

    if (data.Type === "embed") {
      await channel.send({
        content: `${interaction.user},<@&${data.Support}>`,
        embeds: [embed],
        components: [row, row2],
      });
    } else {
      await channel.send({
        content: `${interaction.user},<@&${data.Support}>\n${data.Internal}`,
        components: [row, row2],
      });
    }

    if (ticketReason) {
      const reasonEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`**سبب فتح التكت : \`\`\` ${ticketReason} \`\`\`**`)
        .setTimestamp();

      await channel.send({ embeds: [reasonEmbed] });
    }
  } catch (err) {
    console.error(err);
    interaction.reply({
      content: "⚠️ حصل خطأ أثناء إنشاء التذكرة",
      ephemeral: true,
    });
  }
}
