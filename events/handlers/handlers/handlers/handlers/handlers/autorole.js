const { 
  Events 
} = require("discord.js");
const { Database } = require("st.db");

const rolesDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const [prefix, guildId, roleId] = interaction.customId.split("_");

    // لازم يبدأ بـ getrole_
    if (prefix !== "getrole") return;

    // التأكد إن الرتبة موجودة
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) {
      return interaction.reply({
        content: `❌ **عذرًا، هذه الرتبة غير موجودة.**`,
        ephemeral: true,
      });
    }

    const member = interaction.member;

    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        return interaction.reply({
          content: `🗑️ **تمت إزالة الرتبة ${role.name} منك.**`,
          ephemeral: true,
        });
      } else {
        await member.roles.add(roleId);
        return interaction.reply({
          content: `✅ **تم منحك الرتبة ${role.name}!**`,
          ephemeral: true,
        });
      }
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: `⚠️ **حدث خطأ أثناء محاولة تعديل رتبتك.**`,
        ephemeral: true,
      });
    }
  });
};
