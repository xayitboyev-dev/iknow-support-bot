const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('teacher:break:selectTime');
const { selectTime } = require('../../../keyboards/button');
const Lesson = require("../../../models/Lesson");
const { times } = require("../../../config/config.json");
const auth = require("../../../middlewares/auth");

scene.enter(async (ctx) => {
    try {
        ctx.scene.state.lessons = await Lesson.find({ teacher: ctx.state.user._id, date: ctx.scene.state.date, status: { $in: ["confirmed", "pending"] } }).select("time type").lean();

        ctx.reply("Yaxshi, endi band qilib qo'ymoqchi bo'lgan vaqtingizni tanlang.", { ...selectTime(ctx.scene.state.lessons, true) });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("text", auth, async (ctx) => {
    try {
        const time = times.find((item) => item == ctx.message.text.slice(0, 5));
        const exists = ctx.scene.state.lessons.find((item) => item.time == time);

        if (exists && exists?.type != "break") throw new Error(`❗️ Kechirasiz, ${time} ushbu vaqtingiz allaqachon boshqa o'quvchi tomonidan band qilgan.`);
        if (!time) throw new Error("❗️ Vaqt noto'g'ri kiritildi.");

        if (exists?.type === "break") {
            await Lesson.findByIdAndDelete(exists._id);
        } else {
            await Lesson.create({ type: "break", user: ctx.state.user._id, teacher: ctx.state.user._id, topic: "Teacher break time.", date: ctx.scene.state.date, time });
        };

        ctx.scene.state.lessons = await Lesson.find({ teacher: ctx.state.user._id, date: ctx.scene.state.date, status: { $in: ["confirmed", "pending"] } }).select("time type").lean();

        ctx.reply("Band vaqtlaringiz saqlandi.", { ...selectTime(ctx.scene.state.lessons, true) });
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;