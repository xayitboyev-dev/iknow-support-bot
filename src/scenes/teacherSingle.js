const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('teacherSingle');
const { singleTeacher } = require('../keyboards/button');
const getDates = require("../utils/getDates");
const User = require("../models/User");

scene.enter(async (ctx) => {
    try {
        const teacher = await User.findById(ctx.scene.state._id).lean();

        ctx.replyWithPhoto(teacher.image, { ...singleTeacher(), caption: `<b>👤 Ism:</b> ${teacher.first_name} ${teacher.last_name}\n🔖 IELTS Score: ${teacher.ielts}`, parse_mode: "HTML" });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.hears("◀️ Orqaga", (ctx) => {
    ctx.scene.enter("teachers");
});

scene.on("text", (ctx) => {
    const date = getDates().find((item) => item === ctx.message.text);

    if (date) {
        ctx.scene.enter("selectTime", { date, teacher: ctx.scene.state });
    } else {
        ctx.reply("❗️ Iltimos quyida keltirilgan sanalardan tanlang.");
    };
});

module.exports = scene;