const { 
    PermissionsBitField, 
    SlashCommandBuilder 
} = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('قول كلام')
        .addStringOption(option => 
            option.setName('sentence')
                .setDescription('الجملة')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ 
                content: `**لا تمتلك صلاحية لفعل ذلك**`, 
                ephemeral: true 
            });
        }

        const sentence = interaction.options.getString('sentence');

        // يرسل الجملة
        await interaction.channel.send({ content: sentence });

        // يرد برسالة مؤقتة
        const replyMsg = await interaction.reply({ 
            content: `**Done**`, 
            ephemeral: true,
            fetchReply: true
        });

        setTimeout(async () => {
            try {
                await replyMsg.delete().catch(() => {});
            } catch (e) {}
        }, 1500);
    }
};
