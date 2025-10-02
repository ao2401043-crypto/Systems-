const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const systemDB = new Database("/Json-db/Bots/systemDB.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-welcome")
        .setDescription("إعدادات الترحيب")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("روم الترحيب")
                .setRequired(true))
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("رتبة لما يدخل شخص تجيه")
                .setRequired(false))
        .addStringOption(option =>
            option.setName("image")
                .setDescription("صورة لامبد الترحيب (رابط صورة)")
                .setRequired(false)),

    async execute(interaction) {
        try {
            // تحقق من الصلاحيات
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                return interaction.reply({ 
                    content: `**❌ ما عندك صلاحية إدارة السيرفر لاستخدام هذا الأمر**`, 
                    ephemeral: true 
                });
            }

            const channel = interaction.options.getChannel("channel");
            const role = interaction.options.getRole("role");
            const image = interaction.options.getString("image");

            // حفظ البيانات
            await systemDB.set(`welcome_channel_${interaction.guild.id}`, channel.id);

            if (role) {
                await systemDB.set(`welcome_role_${interaction.guild.id}`, role.id);
            } else {
                await systemDB.delete(`welcome_role_${interaction.guild.id}`);
            }

            if (image) {
                await systemDB.set(`welcome_image_${interaction.guild.id}`, image);
            } else {
                await systemDB.delete(`welcome_image_${interaction.guild.id}`);
            }

            // رسالة التأكيد
            await interaction.reply({ 
                content: `✅ تم تحديث إعدادات الترحيب:\n\n📢 الروم: ${channel}\n${role ? `🎭 الرتبة: ${role}` : "🎭 لا يوجد رتبة"}\n${image ? `🖼️ الصورة: ${image}` : "🖼️ لا توجد صورة"}`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error("🔴 خطأ في أمر setup-welcome:", error);
            return interaction.reply({ 
                content: `**❌ صار خطأ أثناء تحديث الإعدادات، اتصل بالمطور.**`, 
                ephemeral: true 
            });
        }
    }
};
