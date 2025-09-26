const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("copy-emoji")
        .setDescription("نسخ إيموجي من سيرفر آخر")
        .addStringOption(option =>
            option
                .setName("emoji")
                .setDescription("الإيموجي")
                .setRequired(true)
        ),

    async execute(interaction) {
        const emojiInput = interaction.options.getString("emoji");
        const { url, name } = getEmojiData(emojiInput);

        if (!url || !name) {
            return interaction.reply({
                content: "❌ | هناك خطأ، تأكد من إدخال إيموجي مخصص صحيح.",
                ephemeral: true
            });
        }

        try {
            const emoji = await interaction.guild.emojis.create({
                attachment: url,
                name: name
            });

            return interaction.reply({
                content: `✅ | تم نسخ الإيموجي بنجاح: ${emoji}`,
                ephemeral: true
            });
        } catch (error) {
            console.error("⛔ Error copying emoji:", error);
            return interaction.reply({
                content: "❌ | حدث خطأ أثناء رفع الإيموجي. تأكد أن للبوت صلاحية **Manage Emojis and Stickers**",
                ephemeral: true
            });
        }
    }
};

/**
 * استخراج رابط واسم الإيموجي
 */
function getEmojiData(emojiInput) {
    const emojiRegex = /<a?:(\w+):(\d+)>/;
    const match = emojiInput.match(emojiRegex);
    if (match) {
        const name = match[1];
        const id = match[2];
        const isAnimated = emojiInput.startsWith("<a:");
        const url = `https://cdn.discordapp.com/emojis/${id}.${isAnimated ? "gif" : "png"}`;
        return { url, name };
    }
    return { url: null, name: null };
}
