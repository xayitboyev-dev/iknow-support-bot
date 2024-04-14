const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('teachers');
const { teachers } = require('../keyboards/button');
const User = require("../models/User");

scene.enter(async (ctx) => {
    try {
        const users = await User.find({ role: "TEACHER" }).select("first_name last_name ielts image phone active").lean();

        ctx.scene.state.teachers = users.map((item) => ({ _id: item._id, name: item.first_name + " " + item.last_name + " " + item.ielts }));

        ctx.reply("🧑‍🏫 O'qituvchi tanlang:", teachers(ctx.scene.state.teachers));
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("text", (ctx) => {
    try {
        const teacher = ctx.scene.state.teachers.find((item) => item.name === ctx.message.text);

        if (teacher) {
            ctx.scene.enter("teacherSingle", teacher);
        } else {
            ctx.reply("❗️ O'qituvchi topilmadi.");
        };
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;