const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('settings:editName');
const { cancel } = require('../../keyboards/button');
const User = require("../../models/User");

scene.enter(async (ctx) => {
    ctx.reply("Ism familiyangizni kiriting.", cancel);
});

scene.on("text", async (ctx) => {
    try {
        const user = await User.findByIdAndUpdate(ctx.scene.state._id, { full_name: ctx.message.text }, { new: true }).lean();
        await ctx.reply("✅ Ism familiya muvaffaqqiyatli yangilandi.");

        ctx.scene.enter("settings", user);
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

scene.on("message", (ctx) => {
    ctx.reply("❗️ Iltimos ism familiyani faqat harflarda kiriting.");
});

module.exports = scene;