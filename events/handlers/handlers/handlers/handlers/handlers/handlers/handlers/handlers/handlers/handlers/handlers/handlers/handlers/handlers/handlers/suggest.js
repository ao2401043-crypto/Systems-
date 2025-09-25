const {
  Events,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");
const { Database } = require("st.db");

const suggestionsDB = new Database("/Json-db/Bots/suggestionsDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const themsg = interaction.message;

    // منع التصويت أكثر من مرة
    if (suggestionsDB.has(`${themsg.id}_${interaction.user.id}_voted`)) {
      return interaction.reply({
        content: `**لقد قمت بالتصويت مرة بالفعل ✅**`,
        ephemeral: true
      });
    }

    // قراءة الأعداد الحالية
    let oks = suggestionsDB.get(`${themsg.id}_ok`) || 0;
    let nos = suggestionsDB.get(`${themsg.id}_no`) || 0;

    // تحديد نوع التصويت
    if (interaction.customId === "ok_button") {
      oks++;
      await suggestionsDB.set(`${themsg.id}_ok`, oks);
    } else if (interaction.customId === "no_button") {
      nos++;
      await suggestionsDB.set(`${themsg.id}_no`, nos);
    } else {
      return; // أي زر غير معرف
    }

    // حفظ أن المستخدم صوت
    await suggestionsDB.set(`${themsg.id}_${interaction.user.id}_voted`, true);

    // إنشاء الأزرار المحدثة
    const button1 = new ButtonBuilder()
      .setCustomId("ok_button")
      .setLabel(`${oks}`)
      .setEmoji("✔️")
      .setStyle(ButtonStyle.Success);

    const button2 = new ButtonBuilder()
      .setCustomId("no_button")
      .setLabel(`${nos}`)
      .setEmoji("✖️")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(button1, button2);

    // تحديث الرسالة
    await interaction.message.edit({ components: [row] });

    // رد للمستخدم
    return interaction.reply({
      content: `**شكرا لتصويتك 🙏**`,
      ephemeral: true
    });
  });
};
