const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('settings:updatePhone');
const { settingsUpdatePhone } = require('../../keyboards/button');
const User = require("../../models/User");

scene.enter(async (ctx) => {
    ctx.reply("Telefon raqamingizni 941234567 formatda kiriting.", settingsUpdatePhone);
});

scene.on(["text", "contact"], async (ctx) => {
    const phone = ctx.message?.contact?.phone_number && "+" + ctx.message?.contact?.phone_number || (ctx.message.text.includes("+998") ? ctx.message.text : "+998" + ctx.message.text).split(" ").join("");

    try {
        const user = await User.findByIdAndUpdate(ctx.scene.state._id, { phone }).lean();
        await ctx.reply("✅ Telefon raqam yangilandi.");

        ctx.scene.enter("settings", user);
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

scene.on("message", (ctx) => {
    ctx.reply("❗️ Iltimos ism familiyani faqat harflarda kiriting.");
});

module.exports = scene;