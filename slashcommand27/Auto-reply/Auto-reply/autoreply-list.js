const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { Database } = require("st.db");
const one4allDB = new Database("/Json-db/Bots/one4allDB.json");

module.exports = {
  adminsOnly: true,
  data: new SlashCommandBuilder()
    .setName("autoreply-list")
    .setDescription("لرؤية جميع الردود"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      const data = one4allDB.get(`replys_${interaction.guild.id}`);

      if (!data || data.length === 0) {
        return interaction.editReply({
          content: `**لا توجد أي ردود تلقائية مسجلة لهذا السيرفر.**`,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("📋 جميع الردود التلقائية")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
          text: `Requested by: ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      const fields = data.map((d, i) => ({
        name: `#${i + 1} | الكلمة: \`${d.word}\``,
        value: `**الرد:** ${d.reply}`,
      }));

      embed.addFields(fields);
      embed.addFields({
        name: "\u200B",
        value: `\`\`\`يوجد ${data.length} رد/ردود في السيرفر\`\`\``,
      });

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: `**لقد حدث خطأ، اتصل بالمطورين**`,
      });
    }
  },
};
