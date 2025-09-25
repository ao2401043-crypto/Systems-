const { Events } = require("discord.js");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const [type, value] = interaction.customId.split('_', 2);

    if (!value) {
      return interaction.reply({ 
        content: "⚠️ لم يتم العثور على قيمة للزر.", 
        ephemeral: true 
      });
    }

    if (type === "tax" || type === "mediator") {
      await interaction.reply({ content: value, ephemeral: true });
    }
  });
};
