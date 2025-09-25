const { 
    Events, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder 
} = require("discord.js");
const { Database } = require("st.db");

const applyDB = new Database("/Json-db/Bots/applyDB.json");

module.exports = (client13) => {
    client13.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isModalSubmit() && interaction.customId === "modal_apply") {
            
            // الحصول على الأسئلة
            const questions = applyDB.get(`apply_${interaction.guild.id}`) || {};
            let qu_1 = questions.ask1 ?? 'غير محدد';
            let qu_2 = questions.ask2 ?? 'غير محدد';
            let qu_3 = questions.ask3 ?? 'غير محدد';
            let qu_4 = questions.ask4 ?? 'غير محدد';
            let qu_5 = questions.ask5 ?? 'غير محدد';

            // إعدادات الروم
            const settings = applyDB.get(`apply_settings_${interaction.guild.id}`) || {};
            let appliesroom = settings.appliesroom;

            let ask_1 = questions.ask1 ? interaction.fields.getTextInputValue("ask_1") : null;
            let ask_2 = questions.ask2 ? interaction.fields.getTextInputValue("ask_2") : null;
            let ask_3 = questions.ask3 ? interaction.fields.getTextInputValue("ask_3") : null;
            let ask_4 = questions.ask4 ? interaction.fields.getTextInputValue("ask_4") : null;
            let ask_5 = questions.ask5 ? interaction.fields.getTextInputValue("ask_5") : null;

            let appliesroomsend = interaction.guild.channels.cache.get(appliesroom);
            if (!appliesroomsend) {
                return interaction.reply({ 
                    content: `⚠️ لم أستطع العثور على روم التقديمات. تأكد من الإعدادات`, 
                    ephemeral: true 
                });
            }

            // إنشاء الـ Embed
            let embedsend = new EmbedBuilder()
                .setTitle(`${interaction.user.id}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('Random')
                .setAuthor({
                    name: interaction.user.username, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            if (ask_1 !== null) embedsend.addFields({ name: `**السؤال الأول : ** ${qu_1}`, value: `\`\`\`${ask_1}\`\`\``, inline: false });
            if (ask_2 !== null) embedsend.addFields({ name: `**السؤال الثاني : ** ${qu_2}`, value: `\`\`\`${ask_2}\`\`\``, inline: false });
            if (ask_3 !== null) embedsend.addFields({ name: `**السؤال الثالث : ** ${qu_3}`, value: `\`\`\`${ask_3}\`\`\``, inline: false });
            if (ask_4 !== null) embedsend.addFields({ name: `**السؤال الرابع : ** ${qu_4}`, value: `\`\`\`${ask_4}\`\`\``, inline: false });
            if (ask_5 !== null) embedsend.addFields({ name: `**السؤال الخامس : ** ${qu_5}`, value: `\`\`\`${ask_5}\`\`\``, inline: false });

            embedsend.addFields(
                { name: `**انضم للديسكورد منذ :**`, value: `> <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: `**انضم للسيرفر منذ :**`, value: `> <t:${Math.floor(interaction.member.joinedAt / 1000)}:R>`, inline: true }
            );

            // الأزرار
            const accept = new ButtonBuilder()
                .setCustomId("apply_accept")
                .setLabel("قبول")
                .setEmoji("☑️")
                .setStyle(ButtonStyle.Success);

            const reject = new ButtonBuilder()
                .setCustomId("apply_reject")
                .setLabel("رفض")
                .setEmoji("✖️")
                .setStyle(ButtonStyle.Danger);

            const reject_with_reason = new ButtonBuilder()
                .setCustomId("apply_reject_with_reason")
                .setLabel("رفض مع سبب")
                .setEmoji("💡")
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(accept, reject, reject_with_reason);

            // رد على المقدم
            await interaction.reply({ content: `✅ تم إرسال تقديمك بنجاح`, ephemeral: true });

            // إرسال التقديم للروم المخصص
            return appliesroomsend.send({ embeds: [embedsend], components: [row] });
        }
    });
};
