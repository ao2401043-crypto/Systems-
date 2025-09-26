const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("set-feedback-line")
        .setDescription("تحديد الخط (سيُستخدم للرسائل أو التصاميم)")
        .addStringOption(option =>
            option
                .setName("line")
                .setDescription("اكتب اسم الخط أو الرابط")
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const line = interaction.options.getString("line");
            await feedbackDB.set(`line_${interaction.guild.id}`, line);

            const embed = new EmbedBuilder()
                .setTitle("✅ تم تحديد الخط")
                .setDescription(`**الخط المختار:** \`${line}\``)
                .setColor("Green")
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("⛔ | Error in set-feedback-line command:", error);
            return interaction.editReply({
                content: "❌ حدث خطأ أثناء حفظ الخط.",
                ephemeral: true,
            });
        }
    },
};
