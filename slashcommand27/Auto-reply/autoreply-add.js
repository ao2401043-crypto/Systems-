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
    .setName("autoreply-add")
    .setDescription("لاضافة رد تلقائي")
    .addStringOption((option) =>
      option.setName("word").setDescription("الكلمة").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reply").setDescription("الرد").setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      await interaction.deferReply({ ephemeral: false });

      const word = interaction.options.getString("word");
      const reply = interaction.options.getString("reply");

      let data = one4allDB.get(`replys_${interaction.guild.id}`) || [];

      const replyCheck = data.find((r) => r.word === word);
      if (replyCheck) {
        return interaction.editReply({
          content: `**هذا الرد \`${word}\` موجود بالفعل**`,
        });
      }

      data.push({
        word,
        reply,
        addedBy: interaction.user.id,
      });

      one4allDB.set(`replys_${interaction.guild.id}`, data);

      await interaction.editReply({
        content: `**✅ تم اضافة الرد التلقائي لكلمة __${word}__**`,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: `**لقد حدث خطأ، اتصل بالمطورين**`,
      });
    }
  },
};
