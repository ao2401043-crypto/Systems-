const {
  Events,
  ModalBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonStyle,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

const { Database } = require("st.db");
const applyDB = new Database("/Json-db/Bots/applyDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // زر التقديم
    if (interaction.customId === "apply_button") {
      const settings = applyDB.get(`apply_settings_${interaction.guild.id}`);
      if (!settings) {
        return interaction.reply({
          content: `**لم يتم تحديد الاعدادات**`,
          ephemeral: true,
        });
      }

      const findApply = applyDB.get(`apply_${interaction.guild.id}`);
      if (!findApply) {
        return interaction.reply({
          content: `**لا يوجد تقديم مفتوح في الوقت الحالي**`,
          ephemeral: true,
        });
      }

      if (interaction.member.roles.cache.has(findApply.roleid)) {
        return interaction.reply({
          content: `**لديك هذه الرتبة <@&${findApply.roleid}> بالفعل**`,
          ephemeral: true,
        });
      }

      // إنشاء المودال
      const modal = new ModalBuilder()
        .setCustomId("modal_apply")
        .setTitle("التقديم على رتبة");

      // إضافة الأسئلة (فقط إذا موجودة)
      if (findApply.ask1) {
        const ask1 = new TextInputBuilder()
          .setCustomId("ask_1")
          .setLabel(findApply.ask1)
          .setStyle(TextInputStyle.Short);
        modal.addComponents(new ActionRowBuilder().addComponents(ask1));
      }

      if (findApply.ask2) {
        const ask2 = new TextInputBuilder()
          .setCustomId("ask_2")
          .setLabel(findApply.ask2)
          .setStyle(TextInputStyle.Short);
        modal.addComponents(new ActionRowBuilder().addComponents(ask2));
      }

      if (findApply.ask3) {
        const ask3 = new TextInputBuilder()
          .setCustomId("ask_3")
          .setLabel(findApply.ask3)
          .setStyle(TextInputStyle.Short);
        modal.addComponents(new ActionRowBuilder().addComponents(ask3));
      }

      if (findApply.ask4) {
        const ask4 = new TextInputBuilder()
          .setCustomId("ask_4")
          .setLabel(findApply.ask4)
          .setStyle(TextInputStyle.Short);
        modal.addComponents(new ActionRowBuilder().addComponents(ask4));
      }

      if (findApply.ask5) {
        const ask5 = new TextInputBuilder()
          .setCustomId("ask_5")
          .setLabel(findApply.ask5)
          .setStyle(TextInputStyle.Short);
        modal.addComponents(new ActionRowBuilder().addComponents(ask5));
      }

      await interaction.showModal(modal);
    }

    // زر الرفض مع السبب
    if (interaction.customId === "apply_reject_with_reason") {
      const settings = applyDB.get(`apply_settings_${interaction.guild.id}`);
      if (!settings || !settings.adminrole) {
        return interaction.reply({
          content: `**لم يتم تحديد رتبة الإدارة**`,
          ephemeral: true,
        });
      }

      const adminrole = settings.adminrole;
      if (!interaction.member.roles.cache.has(adminrole)) {
        return interaction.reply({
          content: `**لا تمتلك الصلاحية لفعل هذا**`,
          ephemeral: true,
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("modal_reject_with_reason")
        .setTitle("رفض مع سبب");

      const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("السبب")
        .setStyle(TextInputStyle.Short);

      modal.addComponents(new ActionRowBuilder().addComponents(reason));
      await interaction.showModal(modal);
    }
  });
};
