const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('selectTime');
const { selectTime } = require('../keyboards/button');
const Lesson = require("../models/Lesson");
const User = require("../models/User");
const { times } = require("../config/config.json");
const auth = require("../middlewares/auth");

scene.enter(async (ctx) => {
    try {
        ctx.scene.state.lessons = await Lesson.find({ date: ctx.scene.state.date }).lean();

        ctx.reply("Sana: " + ctx.scene.state.date, { ...selectTime(ctx.scene.state.lessons) });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.hears("◀️ Orqaga", (ctx) => {
    ctx.scene.enter("teachers");
});

scene.on("text", auth, async (ctx) => {
    try {
        const time = times.find((item) => item == ctx.message.text.slice(0, 5));
        const exists = ctx.scene.state.lessons.find((item) => item.time == time);
        console.log(time)

        if (exists) throw new Error(`❗️ Kechirasiz, ${time} vaqtni allaqachon boshqa o'quvchi band qilgan.`);
        if (!time) throw new Error("❗️ Vaqt noto'g'ri kiritildi.");

        await Lesson.create({ user: ctx.state.user._id, teacher: ctx.scene.state.teacher._id, date: ctx.scene.state.date, time: time });

        ctx.reply("Booked");
        ctx.scene.enter("teachers");
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;