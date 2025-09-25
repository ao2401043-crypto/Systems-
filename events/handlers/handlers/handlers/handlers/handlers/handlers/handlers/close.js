const { Events, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/ticketDB");
const confirme = "هل انت متأكد من إغلاقك للتذكرة؟";
const discordTranscripts = require("discord-html-transcripts");

module.exports = (client7) => {
  client7.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    // تأكيد إغلاق التذكرة
    if (customId === "close") {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("Yes11").setLabel("Close").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("No11").setLabel("Cancel").setStyle(ButtonStyle.Secondary)
      );

      return interaction.reply({ content: confirme, components: [row], ephemeral: true });
    }

    // إغلاق التذكرة
    if (customId === "Yes11") {
      const Ticket = db.get(`TICKET-PANEL_${interaction.channel.id}`);
      if (!Ticket) return interaction.reply({ content: "⚠️ هذه التذكرة غير مسجلة في قاعدة البيانات", ephemeral: true });

      await interaction.channel.permissionOverwrites.edit(Ticket.author, { ViewChannel: false });

      const embed2 = new EmbedBuilder()
        .setDescription(`تم إغلاق التذكرة بواسطة ${interaction.user}`)
        .setColor("Yellow");

      const embed = new EmbedBuilder()
        .setDescription("```لوحة فريق الدعم.```")
        .setColor("DarkButNotBlack");

      const roww = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("delete").setLabel("Delete").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("Open").setLabel("Open").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("Tran").setLabel("Transcript").setStyle(ButtonStyle.Secondary)
      );

      await interaction.update({
        content: "",
        embeds: [embed2, embed],
        components: [roww],
      });

      const Logs = db.get(`LogsRoom_${interaction.guild.id}`);
      const logChannel = interaction.guild.channels.cache.get(Logs);
      if (logChannel) {
        const embedLog = new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
          .setTitle("Close Ticket")
          .setFields(
            { name: "Name Ticket", value: `${interaction.channel.name}` },
            { name: "Owner Ticket", value: `${Ticket.author}` },
            { name: "Closed By", value: `${interaction.user}` }
          )
          .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

        logChannel.send({ embeds: [embedLog] });
      }
    }

    // إلغاء الإغلاق
    if (customId === "No11") {
      return interaction.update({ content: "❌ تم إلغاء الإغلاق", components: [] });
    }

    // حذف التذكرة
    if (customId === "delete") {
      await interaction.reply({
        content: `#${interaction.channel.name} سيتم حذفه خلال 5 ثواني :unlock:`,
        ephemeral: true,
      });

      const Ticket = db.get(`TICKET-PANEL_${interaction.channel.id}`);
      const Logs = db.get(`LogsRoom_${interaction.guild.id}`);
      const logChannel = interaction.guild.channels.cache.get(Logs);

      setTimeout(async () => {
        await interaction.channel.delete().catch(() => {});
        if (logChannel && Ticket) {
          const embedLog = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTitle("Delete Ticket")
            .setFields(
              { name: "Name Ticket", value: `${interaction.channel.name}` },
              { name: "Owner Ticket", value: `${Ticket.author}` },
              { name: "Deleted By", value: `${interaction.user}` }
            )
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

          logChannel.send({ embeds: [embedLog] });
        }
        db.delete(`TICKET-PANEL_${interaction.channel.id}`);
      }, 5000);
    }

    // إعادة فتح التذكرة
    if (customId === "Open") {
      const Ticket = db.get(`TICKET-PANEL_${interaction.channel.id}`);
      if (Ticket?.author) {
        await interaction.channel.permissionOverwrites.edit(Ticket.author, { ViewChannel: true });
      }
      return interaction.update({ content: "✅ تم فتح التذكرة مجدداً", components: [] });
    }

    // ترانسكربت للتذكرة
    if (customId === "Tran") {
      const Ticket = db.get(`TICKET-PANEL_${interaction.channel.id}`);
      if (!Ticket) return interaction.reply({ content: "⚠️ لا توجد بيانات لهذه التذكرة", ephemeral: true });

      const attachment = await discordTranscripts.createTranscript(interaction.channel);
      const Logs = db.get(`LogsRoom_${interaction.guild.id}`);
      const Trans = db.get(`TransRoom_${interaction.guild.id}`);

      const logChannel = interaction.guild.channels.cache.get(Logs);
      const TransChannel = interaction.guild.channels.cache.get(Trans);

      if (!TransChannel) {
        return interaction.reply({ content: "⚠️ لم يتم تحديد روم لترانسكربت، استخدم /set-trans لتحديده.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setTitle("Transcripted Ticket")
        .setFields(
          { name: "Name Ticket", value: `${interaction.channel.name}` },
          { name: "Owner Ticket", value: `${Ticket.author}` },
          { name: "Transcript By", value: `${interaction.user}` }
        )
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

      if (logChannel) logChannel.send({ embeds: [embed] });
      await TransChannel.send({ files: [attachment] });

      return interaction.reply({
        content: `✅ تم حفظ نسخة من التذكرة #${interaction.channel.name}`,
        ephemeral: true,
      });
    }
  });
};
