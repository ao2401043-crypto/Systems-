const { 
  Events, 
  Client, 
  ActivityType, 
  EmbedBuilder, 
  ButtonStyle, 
  ActionRowBuilder, 
  ButtonBuilder 
} = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/BroadcastDB");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "run_broadcast_button") {
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("send_online")
          .setLabel("إرسال للأونلاين")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("send_offline")
          .setLabel("إرسال للأوفلاين")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("send_all")
          .setLabel("إرسال للجميع")
          .setStyle(ButtonStyle.Primary)
      );

      return interaction.reply({
        content: "اختر نوع الارسال:",
        components: [buttons],
        ephemeral: true,
      });
    }

    if (
      ["send_online", "send_offline", "send_all"].includes(interaction.customId)
    ) {
      await interaction.reply({
        content: "جارٍ تجهيز البرودكاست...",
        ephemeral: true,
      });

      const thetokens = db.get(`tokens_${interaction.guild.id}`);
      if (!thetokens || thetokens.length <= 0)
        return interaction.editReply({
          content: `**لم يتم اضافة اي توكن لبوتات البرودكاست**`,
        });

      const broadcast_msg = db.get(`broadcast_msg_${interaction.guild.id}`);
      if (!broadcast_msg)
        return interaction.editReply({
          content: `**لم يتم تحديد رسالة البرودكاست**`,
        });

      await interaction.guild.members.fetch();
      let allMembers = interaction.guild.members.cache;

      if (interaction.customId === "send_online") {
        allMembers = allMembers.filter(
          (m) =>
            !m.user.bot &&
            (m.presence?.status === "online" ||
              m.presence?.status === "dnd" ||
              m.presence?.status === "idle" ||
              m.presence?.activities.some(
                (a) => a.type === ActivityType.Streaming
              ))
        );
      } else if (interaction.customId === "send_offline") {
        allMembers = allMembers.filter(
          (m) => !m.user.bot && (!m.presence || m.presence.status === "offline")
        );
      } else {
        allMembers = allMembers.filter((m) => !m.user.bot);
      }

      const membersIds = allMembers.map((m) => m.user.id);
      const botsNum = thetokens.length;
      const membersPerBot = Math.ceil(membersIds.length / botsNum);
      const subgroups = [];

      for (let i = 0; i < membersIds.length; i += membersPerBot) {
        subgroups.push(membersIds.slice(i, i + membersPerBot));
      }

      let done = 0;
      let failed = 0;

      const statusEmbed = (title, color) =>
        new EmbedBuilder()
          .setTitle(title)
          .setColor(color)
          .setDescription(
            `⚫ عدد الاعضاء : \`${membersIds.length}\`\n🟢 تم الارسال الى : \`${done}\`\n🔴 فشل الارسال الى : \`${failed}\``
          );

      const msg = await interaction.followUp({
        embeds: [statusEmbed("**تم البدأ في ارسال رسالة البرودكاست**", "Aqua")],
      });

      for (let i = 0; i < subgroups.length; i++) {
        const token = thetokens[i];
        const clienter = new Client({ intents: 131071 });

        clienter.once("ready", async () => {
          for (const userId of subgroups[i]) {
            try {
              const user = await clienter.users.fetch(userId);
              await user.send(`**${broadcast_msg}\n<@${userId}>**`);
              done++;
            } catch {
              failed++;
            }

            await msg.edit({
              embeds: [statusEmbed("**جاري ارسال البرودكاست...**", "Aqua")],
            });

            if (done + failed >= membersIds.length) {
              await msg.edit({
                embeds: [statusEmbed("**تم الانتهاء من ارسال البرودكاست**", "Green")],
              });
            }
          }
        });

        await clienter.login(token);
      }
    }
  });
};
