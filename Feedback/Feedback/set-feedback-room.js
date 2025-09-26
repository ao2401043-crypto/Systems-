const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { Database } = require("st.db");
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json");

module.exports = {
  adminsOnly: true,
  data: new SlashCommandBuilder()
    .setName("set-feedback-room")
    .setDescription("تحديد روم الأراء")
    .addChannelOption(option =>
      option
        .setName("room")
        .setDescription("الروم الذي سيُحدد للأراء")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText) // يمنع اختيار روم مو نصي
    ),

  async execute(interaction) {
    try {
      const room = interaction.options.getChannel("room");

      await feedbackDB.set(`feedback_room_${interaction.guild.id}`, room.id);

      return interaction.reply({
        content: `✅ **تم تحديد الروم بنجاح:** <#${room.id}>`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("⛔ Error in set-feedback-room:", error);
      return interaction.reply({
        content: "❌ **حدث خطأ أثناء محاولة تحديد الروم.**",
        ephemeral: true,
      });
    }
  },
};
