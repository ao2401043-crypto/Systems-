const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/BroadcastDB.json");

module.exports = {
  adminsOnly: true,
  data: new SlashCommandBuilder()
    .setName("send-broadcast-panel")
    .setDescription("ارسال بانل التحكم في البرودكاست"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const broadcast_msg =
        db.get(`broadcast_msg_${interaction.guild.id}`) ?? "لم يتم تحديد رسالة";

      const msgid = db.get(`msgid_${interaction.guild.id}`);
      if (msgid) {
        for (const channel of interaction.guild.channels.cache.values()) {
          try {
            const msg = await channel.messages.fetch(msgid).catch(() => null);
            if (msg) await msg.delete().catch(() => {});
          } catch {
            continue;
          }
        }
      }

      const tokens = db.get(`tokens_${interaction.guild.id}`) ?? [];

      const embed = new EmbedBuilder()
        .setTitle("**التحكم في البرودكاست**")
        .addFields(
          {
            name: `**عدد البوتات المسجلة حاليا**`,
            value: `**\`\`\`${tokens.length} من البوتات\`\`\`**`,
            inline: false,
          },
          {
            name: `**رسالة البرودكاست الحالية**`,
            value: `**\`\`\`${broadcast_msg}\`\`\`**`,
            inline: false,
          }
        )
        .setDescription("**يمكنك التحكم في البوت عن طريق الازرار**")
        .setColor("Aqua")
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();

      const add_token = new ButtonBuilder()
        .setCustomId("add_token_button")
        .setLabel("اضافة توكن برودكاست")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🤖");

      const broadcast_message = new ButtonBuilder()
        .setCustomId("broadcast_message_button")
        .setLabel("تحديد رسالة البرودكاست")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📡");

      const start_broadcast = new ButtonBuilder()
        .setCustomId("run_broadcast_button")
        .setLabel("بدأ ارسال البرودكاست")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅");

      const row = new ActionRowBuilder().addComponents(
        add_token,
        broadcast_message,
        start_broadcast
      );

      const newmsg = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      await db.set(`msgid_${interaction.guild.id}`, newmsg.id);
    } catch (error) {
      console.error("⛔ Error in send-broadcast-panel:", error);
      return interaction.editReply({
        content: "**حدث خطأ أثناء إرسال البانل.**",
      });
    }
  },
};
