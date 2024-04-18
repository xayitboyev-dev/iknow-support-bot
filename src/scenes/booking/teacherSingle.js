const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('booking:teacherSingle');
const { singleTeacher } = require('../../keyboards/button');
const getDates = require("../../utils/getDates");
const getRating = require("../../utils/getRating");
const User = require("../../models/User");

scene.enter(async (ctx) => {
    try {
        const teacher = await User.findById(ctx.scene.state._id);

        ctx.replyWithPhoto(teacher.image, { ...singleTeacher(), caption: `<b>👤 Ism:</b> ${teacher.full_name}\n🔖 IELTS Score: ${teacher.ielts}\n🏫 Filial: ${teacher.branch}\n⭐️ Reyting: ${getRating(teacher.ratings)}\n\nUstozning darsiga yozilishni istasangiz o'zingizga mos keladigan sanani tanlang. (3 ish kuni)`, parse_mode: "HTML" });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("text", (ctx) => {
    const date = getDates().find((item) => item.date === ctx.message.text);

    if (date) {
        if (date.holiday) {
            ctx.reply("❗️ Biz bu sanada dam olamiz.");
        } else {
            ctx.scene.enter("booking:selectTime", { date: date.date, teacher: ctx.scene.state });
        };
    } else {
        ctx.reply("❗️ Iltimos quyida keltirilgan sanalardan tanlang.");
    };
});

module.exports = scene;