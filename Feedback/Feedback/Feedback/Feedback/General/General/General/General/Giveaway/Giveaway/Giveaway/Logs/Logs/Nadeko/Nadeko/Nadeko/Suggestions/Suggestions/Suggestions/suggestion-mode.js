const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");
const suggestionsDB = new Database("/Json-db/Bots/suggestionsDB.json");

module.exports = {
    adminsOnly: true,
    data: new SlashCommandBuilder()
        .setName("suggestion-mode")
        .setDescription("تحديد وضع الاقتراحات (أزرار أو رياكشنات)")
        .addStringOption(option =>
            option
                .setName("mode")
                .setDescription("اختر مابين الأزرار أو الرياكشنات")
                .setRequired(true)
                .addChoices(
                    { name: "أزرار", value: "buttons" },
                    { name: "رياكشنات", value: "reactions" }
                )
        )
        .addStringOption(option =>
            option
                .setName("thread")
                .setDescription("تشغيل أو تعطيل الثريد للمناقشة")
                .setRequired(false)
                .addChoices(
                    { name: "تفعيل", value: "enabled" },
                    { name: "تعطيل", value: "disabled" }
                )
        ),

    async execute(interaction) {
        try {
            const mode = interaction.options.getString("mode");
            const threadMode = interaction.options.getString("thread");

            await suggestionsDB.set(`suggestion_mode_${interaction.guild.id}`, mode);

            let replyMessage = `✅ تم ضبط وضع الاقتراحات على **${mode === "buttons" ? "أزرار" : "رياكشنات"}**`;

            if (threadMode) {
                await suggestionsDB.set(`thread_mode_${interaction.guild.id}`, threadMode);
                replyMessage += `\n💬 وضع الثريد: **${threadMode === "enabled" ? "مفعل" : "معطل"}**`;
            }

            return interaction.reply({
                content: replyMessage,
                ephemeral: true
            });
        } catch (error) {
            console.error("⛔ | Error in suggestion-mode command:", error);
            return interaction.reply({
                content: "⚠️ حدث خطأ أثناء ضبط وضع الاقتراحات.",
                ephemeral: true
            });
        }
    }
};
