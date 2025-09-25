const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} = require("discord.js");
const { Database } = require("st.db");
const one4allDB = new Database("/Json-db/Bots/one4allDB.json");

module.exports = {
  adminsOnly: true,
  data: new SlashCommandBuilder()
    .setName("autoreply-remove")
    .setDescription("لازالة رد تلقائي")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("الكلمة")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      const word = interaction.options.getString("word");
      const replysCheck = one4allDB.get(`replys_${interaction.guild.id}`);

      // لو مافي أي ردود
      if (!replysCheck || replysCheck.length === 0) {
        return interaction.editReply({
          content: `**لا يوجد رد بهذه الكلمة \`${word}\`**`,
        });
      }

      // البحث عن الرد
      const data = replysCheck.find((r) => r.word === word);

      if (!data) {
        return interaction.editReply({
          content: `**لا يوجد رد بهذه الكلمة \`${word}\`**`,
        });
      }

      // حذف الرد
      const replysFiltered = replysCheck.filter((r) => r.word !== word);
      await one4allDB.set(`replys_${interaction.guild.id}`, replysFiltered);

      return interaction.editReply({
        content: `**✅ تم حذف الرد التلقائي \`${word}\`**`,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: `**لقد حدث خطأ، اتصل بالمطورين**`,
      });
    }
  },
};
