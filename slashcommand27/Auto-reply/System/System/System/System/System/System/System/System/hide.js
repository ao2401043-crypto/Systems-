const { 
    Client, 
    PermissionsBitField, 
    SlashCommandBuilder 
} = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("hide")
        .setDescription("إخفاء الروم"),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "**❌ لا تمتلك صلاحية لفعل ذلك**", ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: false });

        await interaction.channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone, 
            { ViewChannel: false }
        );

        return interaction.editReply({ content: `🔒 **تم إخفاء الروم ${interaction.channel} بنجاح**` });
    }
};
