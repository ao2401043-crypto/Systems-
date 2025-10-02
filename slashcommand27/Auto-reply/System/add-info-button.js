const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { Database } = require('st.db');
const { v4: uuidv4 } = require('uuid');
const buttonsDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('add-info-button')
        .setDescription('إضافة زر برسالة محددة')
        .addStringOption(option =>
            option.setName('message-id')
                .setDescription('أيدي الرسالة (يجب أن تكون في نفس الروم)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('لون الزر')
                .setRequired(true)
                .addChoices(
                    { name: 'أزرق', value: 'Primary' },
                    { name: 'أحمر', value: 'Danger' },
                    { name: 'أخضر', value: 'Success' },
                    { name: 'رمادي', value: 'Secondary' },
                ))
        .addStringOption(option =>
            option.setName('label')
                .setDescription('اسم الزر')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('الإيموجي الخاص بالزر')
                .setRequired(false)), 

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const label = interaction.options.getString('label') || null;
        const messageId = interaction.options.getString('message-id');
        const color = interaction.options.getString('color');
        const emoji = interaction.options.getString('emoji') || null;
        const guildId = interaction.guild.id;
        const buttonId = uuidv4(); 

        if (!label && !emoji) {
            return await interaction.editReply('❌ لازم تضيف اسم للزر أو إيموجي على الأقل.');
        }

        const button = new ButtonBuilder()
            .setCustomId(`info_${buttonId}`)
            .setStyle(ButtonStyle[color]);

        if (label) button.setLabel(label);
        if (emoji) button.setEmoji(emoji);

        try {
            const targetMessage = await interaction.channel.messages.fetch(messageId).catch(() => null);
            if (!targetMessage) {
                return await interaction.editReply('❌ ما لقيت الرسالة، تأكد إنك تستخدم الأمر بنفس الروم.');
            }

            let newRow = new ActionRowBuilder();

            if (targetMessage.components.length > 0) {
                const existingRow = ActionRowBuilder.from(targetMessage.components[0]);
                existingRow.components.forEach(comp => newRow.addComponents(comp));
            }

            newRow.addComponents(button);

            await targetMessage.edit({ components: [newRow] });

            await interaction.editReply('✅ تم إضافة الزر، الآن أرسل الرسالة اللي تبغى تربطها به (عندك دقيقة).');

            const filter = (msg) => msg.author.id === interaction.user.id && !msg.author.bot;
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });

            const messageContent = collected.first().content;

            await buttonsDB.set(`${guildId}_${buttonId}`, messageContent);

            await interaction.followUp({
                content: '✅ تم حفظ الرسالة وربطها بالزر بنجاح!',
                ephemeral: true,
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply('⚠️ حدث خطأ أثناء إضافة الزر.');
        }
    }
};
