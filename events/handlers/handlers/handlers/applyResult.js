const {
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { Database } = require("st.db");

const applyDB = new Database("/Json-db/Bots/applyDB.json");

module.exports = (client27) => {
  client27.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton() && interaction.customId !== "modal_reject_with_reason") return;

    const settings = applyDB.get(`apply_settings_${interaction.guild.id}`);
    if (!settings) {
      return interaction.reply({ content: `**لم يتم تحديد الاعدادات**`, ephemeral: true });
    }

    const { resultsroom, adminrole } = settings;

    if (!interaction.member.roles.cache.has(adminrole)) {
      return interaction.reply({ content: `**لا تمتلك الصلاحية لفعل هذا**`, ephemeral: true });
    }

    // زر القبول
    if (interaction.customId === "apply_accept") {
      const receivedEmbed = interaction.message.embeds[0];
      const exampleEmbed = EmbedBuilder.from(receivedEmbed);
      const userId = exampleEmbed.data.title; // ⚠️ الأفضل تخزنه بـ footer أو field
      const user2 = interaction.guild.members.cache.get(userId);

      const findApply = applyDB.get(`apply_${interaction.guild.id}`);
      const role = interaction.guild.roles.cache.get(findApply.roleid);

      try {
        await user2.roles.add(role);

        // رسالة DM
        if (applyDB.get(`dm_${interaction.guild.id}`) === true) {
          const dm_embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTitle("تم قبول تقديمك 🎊")
            .setDescription(`**> الاداري : ${interaction.user}**`)
            .setColor("Green");

          user2.send({ embeds: [dm_embed] }).catch(() => {});
        }

        // إرسال النتيجة في روم النتائج
        const theresultsroom = interaction.guild.channels.cache.get(resultsroom);
        const embed = new EmbedBuilder()
          .setTimestamp()
          .setColor("Green")
          .setTitle(`**تم قبول تقديم**`)
          .setDescription(`**صاحب التقديم : ${user2} \n الاداري : ${interaction.user}**`)
          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

        theresultsroom.send({ content: `${user2}`, embeds: [embed] });

        disableButtons(interaction);
        interaction.reply({ content: `**تم قبول التقديم بنجاح**` });
      } catch (err) {
        return interaction.reply({ content: `عذرا يرجى رفع رتبة البوت`, ephemeral: true });
      }
    }

    // زر الرفض مع سبب (Modal Submit)
    if (interaction.customId === "modal_reject_with_reason") {
      const reason = interaction.fields.getTextInputValue("reason");

      const receivedEmbed = interaction.message.embeds[0];
      const exampleEmbed = EmbedBuilder.from(receivedEmbed);
      const userId = exampleEmbed.data.title;
      const user2 = interaction.guild.members.cache.get(userId);

      const theresultsroom = interaction.guild.channels.cache.get(resultsroom);
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setColor("Red")
        .setTitle(`**تم رفض تقديم**`)
        .setDescription(`** صاحب التقديم : ${user2} \n الاداري : ${interaction.user} \n\n السبب : \`${reason}\`**`)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

      await theresultsroom.send({ embeds: [embed] });

      if (applyDB.get(`dm_${interaction.guild.id}`) === true) {
        const dm_embed = new EmbedBuilder()
          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setTitle("تم رفض تقديمك 😥")
          .setDescription(`**> الاداري : ${interaction.user}** \n **> السبب : ${reason}**`)
          .setColor("Red");

        user2.send({ embeds: [dm_embed] }).catch(() => {});
      }

      disableButtons(interaction);
      interaction.reply({ content: `**تم رفض التقديم بنجاح**` });
    }

    // زر الرفض بدون سبب
    if (interaction.customId === "apply_reject") {
      const receivedEmbed = interaction.message.embeds[0];
      const exampleEmbed = EmbedBuilder.from(receivedEmbed);
      const userId = exampleEmbed.data.title;
      const user2 = interaction.guild.members.cache.get(userId);

      const theresultsroom = interaction.guild.channels.cache.get(resultsroom);
      const embed = new EmbedBuilder()
        .setTimestamp()
        .setColor("Red")
        .setTitle(`**تم رفض تقديم**`)
        .setDescription(`**صاحب التقديم : ${user2} \n الاداري : ${interaction.user}**`)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

      await theresultsroom.send({ embeds: [embed] });

      if (applyDB.get(`dm_${interaction.guild.id}`) === true) {
        const dm_embed = new EmbedBuilder()
          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setTitle("تم رفض تقديمك 😥")
          .setDescription(`**> الاداري : ${interaction.user}**`)
          .setColor("Red");

        user2.send({ embeds: [dm_embed] }).catch(() => {});
      }

      disableButtons(interaction);
      interaction.reply({ content: `**تم رفض التقديم بنجاح**` });
    }
  });
};

// 🔧 دالة لتعطيل الأزرار
function disableButtons(interaction) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`apply_accept`).setLabel(`قبول`).setEmoji("☑️").setStyle(ButtonStyle.Success).setDisabled(true),
    new ButtonBuilder().setCustomId(`apply_reject`).setLabel(`رفض`).setEmoji("✖️").setStyle(ButtonStyle.Danger).setDisabled(true),
    new ButtonBuilder().setCustomId(`apply_reject_with_reason`).setLabel(`رفض مع سبب`).setEmoji("💡").setStyle(ButtonStyle.Danger).setDisabled(true)
  );

  interaction.message.edit({ components: [row] });
}
