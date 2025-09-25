const { Events } = require("discord.js");
const { Database } = require("st.db");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== "ticket_select") return;

    const selected = interaction.values[0];

    if (selected === "reset") {
      try {
        await interaction.update(); // تحديث الرسالة (يفرغ القائمة)
      } catch (error) {
        console.error("خطأ أثناء تحديث التذكرة:", error);
      }
    }
  });
};
