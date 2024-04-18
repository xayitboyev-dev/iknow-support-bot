const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('settings:updateLevel');
const { settingsUpdateLevel } = require('../../keyboards/button');
const User = require("../../models/User");

scene.enter(async (ctx) => {
    ctx.reply("Ingliz tili darajangizni tanlang.", settingsUpdateLevel);
});

scene.on("text", async (ctx) => {
    try {
        const user = await User.findByIdAndUpdate(ctx.scene.state._id, { level: ctx.message.text }).lean();
        await ctx.reply("✅ Daraja muvaffaqqiyatli yangilandi.");

        ctx.scene.enter("settings", user);
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

scene.on("message", (ctx) => {
    ctx.reply("❗️ Iltimos darajani quyida keltirilgan tugmalardan tanlang.");
});

module.exports = scene;