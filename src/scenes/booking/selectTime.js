const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('booking:selectTime');
const { selectTime } = require('../../keyboards/button');
const Lesson = require("../../models/Lesson");
const { times } = require("../../config/config.json");
const auth = require("../../middlewares/auth");

scene.enter(async (ctx) => {
    try {
        ctx.scene.state.lessons = await Lesson.find({ teacher: ctx.scene.state.teacher._id, date: ctx.scene.state.date, status: { $in: ["confirmed", "pending"] } }).select("time").lean();

        ctx.reply("Yaxshi, endi qulay vaqtni tanlang.", { ...selectTime(ctx.scene.state.lessons) });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("text", auth, async (ctx) => {
    try {
        ctx.scene.state.lessons = await Lesson.find({ teacher: ctx.scene.state.teacher._id, date: ctx.scene.state.date, status: { $in: ["confirmed", "pending"] } }).select("time").lean();

        const time = times.find((item) => item == ctx.message.text.slice(0, 5));
        const exists = ctx.scene.state.lessons.find((item) => item.time == time);

        if (exists) throw new Error(`❗️ Kechirasiz, ${time} vaqtni allaqachon boshqa o'quvchi band qilgan.`);
        if (!time) throw new Error("❗️ Vaqt noto'g'ri kiritildi.");

        ctx.scene.state.time = time;

        ctx.scene.enter("booking:selectBranch", ctx.scene.state);
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;