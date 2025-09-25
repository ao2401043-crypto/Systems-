const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const { Database } = require("st.db");

const dd = new Database("/Json-db/Bots/ticketDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    // ---------------------- SELECT MENU ---------------------- //
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "supportPanel") {
        const ticketData = dd.get(`TICKET-PANEL_${interaction.channel.id}`);
        if (!ticketData) return;

        const Support = ticketData.Support;
        if (!interaction.member.roles.cache.has(Support)) {
          return interaction.reply({
            content: `**لا تمتلك الصلاحية لفعل هذا**`,
            ephemeral: true,
          });
        }

        if (interaction.values[0] === "renameTicket") {
          const modal = new ModalBuilder()
            .setTitle("تغيير اسم التكت")
            .setCustomId("renameTicketSubmitModal");

          const newNameInp = new TextInputBuilder()
            .setCustomId("newNameValue")
            .setLabel("اسم التذكرة الجديد")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(new ActionRowBuilder().addComponents(newNameInp));
          return interaction.showModal(modal);
        }

        if (interaction.values[0] === "addMemberToTicket") {
          const modal = new ModalBuilder()
            .setTitle("إضافة عضو للتذكرة")
            .setCustomId("addMemberToTicketSubmitModal");

          const memberIdInp = new TextInputBuilder()
            .setCustomId("addMemberToTicketMemberId")
            .setLabel("ايدي العضو")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(new ActionRowBuilder().addComponents(memberIdInp));
          return interaction.showModal(modal);
        }

        if (interaction.values[0] === "removeMemberFromTicket") {
          const modal = new ModalBuilder()
            .setTitle("حذف عضو من التذكرة")
            .setCustomId("removeMemberFromTicketSubmitModal");

          const memberIdInp = new TextInputBuilder()
            .setCustomId("removeMemberFromTicketMemberId")
            .setLabel("ايدي العضو")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(new ActionRowBuilder().addComponents(memberIdInp));
          return interaction.showModal(modal);
        }

        if (interaction.values[0] === "refreshSupportPanel") {
          return interaction.deferUpdate().catch(() => {});
        }
      }
    }

    // ---------------------- MODALS ---------------------- //
    if (interaction.isModalSubmit()) {
      // RENAME
      if (interaction.customId === "renameTicketSubmitModal") {
        const newName = interaction.fields.getTextInputValue("newNameValue");

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(`**تم تغيير اسم التكت إلى \`${newName}\`**`)
              .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              })
              .setFooter({
                text: `Requested by : ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });

        return interaction.channel.setName(newName).catch(() => {});
      }

      // ADD MEMBER
      if (interaction.customId === "addMemberToTicketSubmitModal") {
        const memberId = interaction.fields.getTextInputValue(
          "addMemberToTicketMemberId"
        );
        const theMember = await interaction.guild.members
          .fetch(memberId)
          .catch(() => null);

        if (!theMember) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`**عذرا لم أجد عضو بهذا الايدي \`${memberId}\`**`),
            ],
            ephemeral: true,
          });
        }

        await interaction.channel.permissionOverwrites.edit(theMember.id, {
          ViewChannel: true,
          SendMessages: true,
        });

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(`**تم إضافة \`${theMember.user.username}\` للتذكرة**`)
              .setFooter({
                text: `Requested by : ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });
      }

      // REMOVE MEMBER
      if (interaction.customId === "removeMemberFromTicketSubmitModal") {
        const memberId = interaction.fields.getTextInputValue(
          "removeMemberFromTicketMemberId"
        );
        const theMember = await interaction.guild.members
          .fetch(memberId)
          .catch(() => null);

        if (!theMember) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`**عذرا لم أجد عضو بهذا الايدي \`${memberId}\`**`),
            ],
            ephemeral: true,
          });
        }

        await interaction.channel.permissionOverwrites.edit(theMember.id, {
          ViewChannel: false,
          SendMessages: false,
        });

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(`**تم حذف \`${theMember.user.username}\` من التذكرة**`)
              .setFooter({
                text: `Requested by : ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
        });
      }
    }
  });
};
