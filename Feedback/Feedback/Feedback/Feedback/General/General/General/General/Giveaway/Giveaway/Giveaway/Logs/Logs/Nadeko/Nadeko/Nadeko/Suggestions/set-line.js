const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const suggestionsDB = new Database("/Json-db/Bots/suggestionsDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("set-suggestions-line")
        .setDescription("تحديد الخط (مثلاً رابط صورة أو نص)")
        .addStringOption(option =>
            option
                .setName("line")
                .setDescription("الخط")
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const line = interaction.options.getString("line");
            await suggestionsDB.set(`line_${interaction.guild.id}`, line);

            const embed = new EmbedBuilder()
                .setDescription("✅ **تم تحديد الخط بنجاح**")
                .setColor("Green")
                .setTimestamp()
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });

            // لو الخط رابط صورة
            if (line.startsWith("http")) {
                embed.setImage(line);
            } else {
                embed.addFields({ name: "الخط", value: line });
            }

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("⛔ | error in set-suggestions-line command", error);
            return interaction.editReply({ content: "⚠️ حدث خطأ أثناء التنفيذ." });
        }
    }
};
