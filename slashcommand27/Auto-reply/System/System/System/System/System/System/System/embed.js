const { 
    ChatInputCommandInteraction, 
    Client, 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionsBitField 
} = require("discord.js");

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("قول كلام في ايمبد")
        .addStringOption(option => 
            option
                .setName("title")
                .setDescription("العنوان")
                .setRequired(true)
        )
        .addAttachmentOption(option => 
            option
                .setName("image")
                .setDescription("صورة")
                .setRequired(false)
        )
        .addChannelOption(option => 
            option
                .setName("channel")
                .setDescription("الروم المستهدف")
                .setRequired(false)
        )
        .addStringOption(option => 
            option
                .setName("color")
                .setDescription("اللون")
                .addChoices(
                    { name: "أحمر", value: "Red" },
                    { name: "أزرق", value: "Blue" },
                    { name: "أزرق فاتح", value: "Aqua" },
                    { name: "أخضر", value: "Green" },
                    { name: "أصفر", value: "Yellow" },
                    { name: "أسود", value: "Black" },
                    { name: "ذهبي", value: "Gold" },
                    { name: "أبيض", value: "White" },
                    { name: "برتقالي", value: "Orange" },
                    { name: "رمادي", value: "Grey" },
                    { name: "بدون لون", value: "DarkButNotBlack" },
                    { name: "عشوائي", value: "Random" }
                )
                .setRequired(false)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.reply({ content: "**❌ لا تمتلك صلاحية لفعل ذلك**", ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            const title = interaction.options.getString("title");
            const imageOption = interaction.options.getAttachment("image");
            const color = interaction.options.getString("color") || "Random";
            const image = imageOption ? imageOption.url : null;
            const channel = interaction.options.getChannel("channel") || interaction.channel;

            const embed = new EmbedBuilder().setColor(color);

            if (title) embed.setTitle(title);
            if (image) embed.setImage(image);

            await interaction.editReply({ content: "✍️ اكتب الرسالة التي تريد وضعها في الـEmbed (لديك دقيقة)." });

            const filter = msg => msg.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

            collector.on("collect", async msg => {
                embed.setDescription(msg.content);

                // نحذف رسالة المستخدم عشان يبان نظيف
                await msg.delete();

                await channel.send({ embeds: [embed] });
                return interaction.followUp({ content: "✅ **تم إرسال الـEmbed بنجاح**", ephemeral: true });
            });

            collector.on("end", collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: "⌛ لم يتم استلام أي رسالة. العملية أُلغيت.", ephemeral: true });
                }
            });

        } catch (error) {
            console.error("🔴 | Error in embed command:", error);
            return interaction.reply({ content: "⚠️ لقد حدث خطأ، اتصل بالمطورين.", ephemeral: true });
        }
    }
};
