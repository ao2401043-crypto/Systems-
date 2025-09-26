const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json");

module.exports = {
  adminsOnly: true,
  data: new SlashCommandBuilder()
    .setName("feedback-mode")
    .setDescription("تحديد وضع الأراء (امبد أو رياكشن فقط)")
    .addStringOption(option =>
      option
        .setName("mode")
        .setDescription("اختر بين الامبد والرياكشن")
        .setRequired(true)
        .addChoices(
          { name: "امبد", value: "embed" },
          { name: "أوتو رياكشن فقط", value: "reactions" }
        )
    )
    .addStringOption(option =>
      option
        .setName("emoji")
        .setDescription("الايموجي (في حالة وضع الاوتو رياكشن فقط)")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const mode = interaction.options.getString("mode");
      const emoji = interaction.options.getString("emoji") || "❤";

      await feedbackDB.set(`feedback_mode_${interaction.guild.id}`, mode);
      await feedbackDB.set(`feedback_emoji_${interaction.guild.id}`, emoji);

      let replyMsg = `✅ تم ضبط وضع الأراء على **${mode}**`;
      if (mode === "reactions") {
        replyMsg += ` باستخدام الايموجي ${emoji}`;
      }

      await interaction.reply({ content: replyMsg, ephemeral: true });
    } catch (error) {
      console.error("⛔ Error in feedback-mode:", error);
      await interaction.reply({
        content: "**حدث خطأ أثناء تنفيذ الأمر.**",
        ephemeral: true,
      });
    }
  },
};
