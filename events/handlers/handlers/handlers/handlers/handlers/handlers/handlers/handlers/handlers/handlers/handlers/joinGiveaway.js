const { 
  Events, EmbedBuilder 
} = require("discord.js");
const { Database } = require("st.db");
const giveawayDB = new Database("/Json-db/Bots/giveawayDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "join_giveaway") return;

    await interaction.deferReply({ ephemeral: true });

    // نجيب قائمة الجيف اواي
    let giveaways = giveawayDB.get(`giveaways_${interaction.guild.id}`);
    if (!giveaways || !Array.isArray(giveaways)) {
      return interaction.editReply({ 
        content: `❌ **لا يوجد أي جيف أواي نشط في هذا السيرفر.**`, 
        ephemeral: true 
      });
    }

    const msgid = interaction.message.id;
    let giveaway = giveaways.find((gu) => gu.messageid === msgid);

    if (!giveaway) {
      return interaction.editReply({ 
        content: `❌ **لم يتم العثور على هذا الجيف أواي**`, 
        ephemeral: true 
      });
    }

    let { prize, winners, dir1, dir2, host } = giveaway;

    // نتأكد أن entries فيها IDs فقط
    if (!Array.isArray(giveaway.entries)) giveaway.entries = [];

    const userId = interaction.user.id;
    const isJoined = giveaway.entries.includes(userId);

    if (!isJoined) {
      // يدخل المستخدم
      giveaway.entries.push(userId);
      await giveawayDB.set(`giveaways_${interaction.guild.id}`, giveaways);

      const embed = new EmbedBuilder()
        .setTitle(`🎉 ${prize}`)
        .setDescription(
          `Ends: <t:${dir1}:R> (<t:${dir1}:f>)\n` +
          `Hosted by: <@${host}>\n` +
          `Entries: **${giveaway.entries.length}**\n` +
          `Winners: **${winners}**`
        )
        .setColor("#5865f2")
        .setTimestamp(new Date(dir2));

      await interaction.message.edit({ embeds: [embed] });
      return interaction.editReply({ 
        content: `✅ **تم دخولك في الجيف أواي بنجاح!**`, 
        ephemeral: true 
      });
    } else {
      // يخرج المستخدم
      giveaway.entries = giveaway.entries.filter((id) => id !== userId);
      await giveawayDB.set(`giveaways_${interaction.guild.id}`, giveaways);

      const embed = new EmbedBuilder()
        .setTitle(`🎉 ${prize}`)
        .setDescription(
          `Ends: <t:${dir1}:R> (<t:${dir1}:f>)\n` +
          `Hosted by: <@${host}>\n` +
          `Entries: **${giveaway.entries.length}**\n` +
          `Winners: **${winners}**`
        )
        .setColor("#5865f2")
        .setTimestamp(new Date(dir2));

      await interaction.message.edit({ embeds: [embed] });
      return interaction.editReply({ 
        content: `🗑️ **تم خروجك من الجيف أواي بنجاح!**`, 
        ephemeral: true 
      });
    }
  });
};
