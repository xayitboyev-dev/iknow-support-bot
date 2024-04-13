const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:teachers');
const { teachers } = require('../keyboards/button');
const User = require("../../models/User");

scene.enter(async (ctx) => {
    try {
        const users = await User.find({ role: "TEACHER" }).select("first_name last_name ielts image phone").lean();

        ctx.scene.state.teachers = users.map((item) => ({ teacher: item, name: item.first_name + " " + item.last_name + " " + item.ielts }));

        ctx.reply("🧑‍🏫 O'qituvchilar ro'yxati:", teachers(ctx.scene.state.teachers));
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.hears("🆕 Yangi qo'shish", (ctx) => {
    ctx.scene.enter("admin:teacherAdd");
});

scene.on("text", (ctx) => {
    try {
        const teacher = ctx.scene.state.teachers.find((item) => item.name === ctx.message.text);

        if (teacher) {
            ctx.scene.enter("admin:teacherSingle", teacher.teacher);
        } else {
            ctx.reply("❗️ O'qituvchi topilmadi.");
        };
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;