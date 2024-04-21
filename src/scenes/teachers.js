const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('teachers');
const { teachers } = require('../keyboards/button');
const getRating = require("../utils/getRating");
const User = require("../models/User");

scene.enter(async (ctx) => {
    try {
        const users = await User.find({ role: "TEACHER", id: { $ne: null }, active: true }).select("full_name ielts id ratings").lean();

        ctx.scene.state.teachers = users.map((item) => ({ _id: item._id, id: item.id, name: item.full_name +  " ⭐️ " + getRating(item.ratings) }));

        ctx.reply("🧑‍🏫 Ustoz tanlang:", teachers(ctx.scene.state.teachers));
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("text", (ctx) => {
    try {
        const teacher = ctx.scene.state.teachers.find((item) => item.name === ctx.message.text);

        if (teacher) {
            ctx.scene.enter("booking:teacherSingle", teacher);
        } else {
            ctx.reply("❗️ Ustoz topilmadi.");
        };
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;