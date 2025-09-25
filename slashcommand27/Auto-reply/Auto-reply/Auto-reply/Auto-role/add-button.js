const { 
  SlashCommandBuilder, 
  ButtonBuilder, 
  ActionRowBuilder, 
  ButtonStyle 
} = require("discord.js");
const { Database } = require("st.db");

module.exports = {
  adminsOnly: true,
  data: new SlashCommandBuilder()
    .setName("add-button")
    .setDescription("اضافة زر لرتبة معينة")
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("الرتبة")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("label")
        .setDescription("اسم الزر")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("message-id")
        .setDescription("ايدي الرسالة")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("color")
        .setDescription("لون الزر")
        .setRequired(true)
        .addChoices(
          { name: "أزرق", value: "Primary" },
          { name: "رمادي", value: "Secondary" },
          { name: "أخضر", value: "Success" },
          { name: "أحمر", value: "Danger" },
        )
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const label = interaction.options.getString("label");
    const messageId = interaction.options.getString("message-id");
    const color = interaction.options.getString("color");
    const guildId = interaction.guild.id;

    try {
      const targetMessage = await interaction.channel.messages.fetch(messageId);
      if (!targetMessage) {
        return await interaction.reply({
          content: "⚠️ لازم تسوي الأمر في نفس الروم اللي فيه الرسالة.",
          ephemeral: true
        });
      }

      const button = new ButtonBuilder()
        .setCustomId(`getrole_${guildId}_${role.id}`)
        .setLabel(label)
        .setStyle(ButtonStyle[color]);

      // لو فيه ActionRow قديم نعيد بناءه
      let newRow;
      if (targetMessage.components.length > 0) {
        newRow = ActionRowBuilder.from(targetMessage.components[0]);
      } else {
        newRow = new ActionRowBuilder();
      }

      newRow.addComponents(button);

      await targetMessage.edit({ components: [newRow] });

      await interaction.reply({
        content: `✅ تم إضافة زر للرتبة **${role.name}** بنجاح!`,
        ephemeral: true
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ حدث خطأ أثناء إضافة الزر!",
        ephemeral: true
      });
    }
  }
};
