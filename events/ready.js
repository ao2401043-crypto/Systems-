const { Client, ActivityType, Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        // الحالة (تقدر تغيرها من ENV برضو لو تحب)
        client.user.setStatus("dnd");

        // النشاط (يتغير من متغير ENV اسمه BOT_ACTIVITY)
        client.user.setActivity({
            name: process.env.BOT_ACTIVITY || "by a7a.00",
            type: ActivityType.Playing, 
        });
        
        console.log(`✅ Bot is now online as ${client.user.tag}`);
    },
};
