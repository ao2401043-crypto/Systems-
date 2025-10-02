const { 
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");
const axios = require("axios");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("banner")
        .setDescription("رؤية بانرك او شخص اخر")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("الشخص")
                .setRequired(false)
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            const user = interaction.options.getUser("user") || interaction.user;

            // إذا عندك systemDB أو tokens خاص للبوت حط الكود هنا
            const data = systemDB.get("botToken");
            if (!data) return await interaction.editReply({ content: "لقد حدث خطأ اتصل بالمطورين" });

            // جلب بيانات المستخدم من API
            const res = await axios.get(`https://discord.com/api/users/${user.id}`, {
                headers: { Authorization: `Bot ${data}` }
            });

            const { banner, accent_color } = res.data;

            if (banner) {
                const extension = banner.startsWith("a_") ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=2048`;

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(5)
                        .setLabel("Download")
                        .setURL(url)
                );

                const embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 1024 }) })
                    .setTitle("Banner link")
                    .setURL(url)
                    .setImage(url)
                    .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                return await interaction.editReply({ embeds: [embed], components: [button] });
            } 
            else if (accent_color) {
                const url = `https://serux.pro/rendercolour?hex=${accent_color}&height=200&width=512`;

                const embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 1024 }) })
                    .setTitle("Accent color preview")
                    .setURL(url)
                    .setImage(url)
                    .setColor(accent_color)
                    .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                return await interaction.editReply({ embeds: [embed] });
            } 
            else {
                return await interaction.editReply({ content: "**هذا العضو لا يمتلك بانر**" });
            }

        } catch (error) {
            console.error("🔴 | Error in banner command:", error);
            return await interaction.editReply({ content: "لقد حدث خطأ اتصل بالمطورين" });
        }
    }
};
