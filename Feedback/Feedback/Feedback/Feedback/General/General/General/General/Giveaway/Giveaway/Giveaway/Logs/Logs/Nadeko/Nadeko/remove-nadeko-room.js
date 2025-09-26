const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/nadekoDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("remove-nadeko-room")
        .setDescription("ازالة روم مفعل الخاصية فيها")
        .addChannelOption(option =>
            option.setName("room")
                .setDescription("الروم")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const room = interaction.options.getChannel("room");
        let rooms = db.get(`rooms_${interaction.guild.id}`) || [];

        if (!rooms.includes(room.id)) {
            return interaction.editReply({ content: `⚠️ **لم يتم اضافة هذه الروم من قبل لكي يتم حذفها**` });
        }

        // حذف الروم من القائمة
        const filtered = rooms.filter(ro => ro !== room.id);
        await db.set(`rooms_${interaction.guild.id}`, filtered);

        return interaction.editReply({ content: `✅ **تم ازالة الروم ${room} بنجاح**` });
    }
};
