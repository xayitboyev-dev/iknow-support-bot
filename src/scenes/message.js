const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('message');
const { cancel } = require('../keyboards/button');

scene.enter((ctx) => {
    ctx.reply(ctx.scene.state.text || "Xabaringizni kiriting.", cancel);
});

scene.on("text", async (ctx) => {
    try {
        await ctx.copyMessage(ctx.scene.state.chatId);
    } catch (error) {
        console.log("message scene error:", error.message);
    };

    ctx.reply("✅ Xabaringiz yuborildi.");
    ctx.scene.enter("main");
});

scene.use((ctx) => {
    ctx.reply("❗️ Faqat to'g'ri formatdagi xabar yuboring.");
});

module.exports = scene;