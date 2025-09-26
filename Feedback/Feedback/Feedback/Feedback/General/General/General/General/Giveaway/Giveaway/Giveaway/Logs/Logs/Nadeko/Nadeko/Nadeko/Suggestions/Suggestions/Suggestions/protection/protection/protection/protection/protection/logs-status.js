const { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/protectDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('protection-status')
        .setDescription('للاستعلام عن حالة نظام الحماية'),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        try {
            const banStatus = db.get(`ban_status_${interaction.guild.id}`) || null;
            const banLimit = db.get(`ban_limit_${interaction.guild.id}`) ?? "غير محدد";

            const botsStatus = db.get(`antibots_status_${interaction.guild.id}`) || null;
            const botsLimit = "غير محدد";

            const deleteRolesStatus = db.get(`antideleteroles_status_${interaction.guild.id}`) || null;
            const deleteRolesLimit = db.get(`antideleteroles_limit_${interaction.guild.id}`) ?? "غير محدد";

            const deleteRoomsStatus = db.get(`antideleterooms_status_${interaction.guild.id}`) || null;
            const deleteRoomsLimit = db.get(`antideleterooms_limit_${interaction.guild.id}`) ?? "غير محدد";

            const embed = new EmbedBuilder()
                .setTitle('📊 حالة نظام الحماية')
                .setColor('Blue')
                .addFields(
                    { name: `الحماية من البوتات`, value: `الحالة : ${botsStatus === "on" ? "🟢" : "🔴"} \n العدد المسموح : \`${botsLimit}\`` },
                    { name: `الحماية من الباند`, value: `الحالة : ${banStatus === "on" ? "🟢" : "🔴"} \n العدد المسموح : \`${banLimit}\`` },
                    { name: `الحماية من حذف الرومات`, value: `الحالة : ${deleteRoomsStatus === "on" ? "🟢" : "🔴"} \n العدد المسموح : \`${deleteRoomsLimit}\`` },
                    { name: `الحماية من حذف الرتب`, value: `الحالة : ${deleteRolesStatus === "on" ? "🟢" : "🔴"} \n العدد المسموح : \`${deleteRolesLimit}\`` }
                )
                .setTimestamp()
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: "⚠️ حدث خطأ أثناء جلب حالة الحماية." });
        }
    }
};
