const { Scenes: { BaseScene }, Markup } = require('telegraf');
const scene = new BaseScene('booking:selectBranch');
const { branches } = require("../../config/config.json");
const auth = require("../../middlewares/auth");
const Lesson = require("../../models/Lesson");

scene.enter(async (ctx) => {
    try {
        ctx.reply("Yaxshi, endi o'zingizga qulay joylashuvni tanlang.", Markup.keyboard([...branches, "◀️ Bekor qilish"]).resize());
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("text", auth, async (ctx) => {
    try {
        const branch = branches.find((item) => item == ctx.message.text);

        if (!branch) throw new Error("❗️ Noto'g'ri filial kiritildi.");

        ctx.scene.state.branch = branch;

        ctx.scene.enter("booking:enterTopic", ctx.scene.state);
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;