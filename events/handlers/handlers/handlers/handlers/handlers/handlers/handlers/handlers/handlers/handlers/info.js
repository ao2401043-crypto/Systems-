const { Events } = require("discord.js");
const { Database } = require("st.db");

const buttonsDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("info_")) return;

    try {
      if (!interaction.guild) {
        return interaction.reply({ 
          content: "❌ هذا الزر يعمل فقط داخل السيرفر.", 
          ephemeral: true 
        });
      }

      // ناخذ كل اللي بعد أول "_" عشان لو الاسم فيه أكثر من فاصلة
      const buttonId = interaction.customId.split("_").slice(1).join("_");
      const guildId = interaction.guild.id;

      const savedMessage = buttonsDB.get(`${guildId}_${buttonId}`);

      if (savedMessage) {
        await interaction.reply({ content: savedMessage, ephemeral: true });
      } else {
        await interaction.reply({ 
          content: "⚠️ لم يتم العثور على رسالة مرتبطة بهذا الزر.", 
          ephemeral: true 
        });
      }
    } catch (error) {
      console.error("❌ خطأ في التعامل مع الزر:", error);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ 
          content: "حدث خطأ غير متوقع أو أن الرسالة طويلة جدًا.", 
          ephemeral: true 
        });
      } else {
        await interaction.reply({ 
          content: "حدث خطأ غير متوقع أو أن الرسالة طويلة جدًا.", 
          ephemeral: true 
        });
      }
    }
  });
};
