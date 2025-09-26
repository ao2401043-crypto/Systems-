const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/nadekoDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("add-nadeko-room")
        .setDescription("اضافة روم يتم تفعيل الخاصية فيها")
        .addChannelOption(option =>
            option.setName("room")
                .setDescription("الروم")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const room = interaction.options.getChannel("room");

        // نحضر القائمة من الداتابيز أو نبدأ مصفوفة فاضية
        let rooms = db.get(`rooms_${interaction.guild.id}`) || [];

        // نتأكد ما نضيف الروم مرتين
        if (rooms.includes(room.id)) {
            return interaction.editReply({ content: `⚠️ **هذا الروم مضاف من قبل**` });
        }

        // نضيف الروم ونحفظه
        rooms.push(room.id);
        await db.set(`rooms_${interaction.guild.id}`, rooms);

        return interaction.editReply({ content: `✅ **تم اضافة الروم ${room} بنجاح**` });
    }
};
