const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const autolineDB = new Database("/Json-db/Bots/autolineDB.json");
const isImage = require('is-image-header');

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-autoline-line')
        .setDescription('تحديد الخط')
        .addStringOption(option => 
            option
                .setName('line')
                .setDescription('الخط (رابط صورة أو نص)')
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const line = interaction.options.getString('line');
            await autolineDB.set(`line_${interaction.guild.id}`, line);

            const embed = new EmbedBuilder()
                .setDescription('✅ **تم تحديد الخط**')
                .setColor('Green')
                .setTimestamp()
                .setFooter({ 
                    text: interaction.guild.name, 
                    iconURL: interaction.guild.iconURL({ dynamic: true }) 
                });

            // لو الرابط صورة نخليه كـ image
            if (line.startsWith("http") && (line.endsWith(".png") || line.endsWith(".jpg") || line.endsWith(".jpeg") || line.endsWith(".gif"))) {
                embed.setImage(line);
            } else {
                embed.addFields({ name: "الخط", value: line });
            }

            return interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.log("⛔ | Error in set-autoline-line command:", error);
            return interaction.editReply({ content: "❌ حصل خطأ غير متوقع." });
        }
    }
};
