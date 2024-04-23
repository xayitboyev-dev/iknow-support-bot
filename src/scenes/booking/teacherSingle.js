const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('booking:teacherSingle');
const { singleTeacher } = require('../../keyboards/button');
const getDates = require("../../utils/getDates");
const getRating = require("../../utils/getRating");
const User = require("../../models/User");
const Lesson = require('../../models/Lesson');
const auth = require("../../middlewares/auth");
const { maximumBookingPeerDay, maximumLessonsPeerDay } = require("../../config/config.json");

scene.enter(async (ctx) => {
    try {
        const teacher = await User.findById(ctx.scene.state._id);

        ctx.replyWithPhoto(teacher.image, { ...singleTeacher(), caption: `<b>👤 Ism:</b> ${teacher.full_name}\n🔖 IELTS Score: ${teacher.ielts}\n⭐️ Reyting: ${getRating(teacher.ratings)}\n🗣 Tili: ${teacher.language == "uz" ? "🇺🇿" : teacher.language == "ru" ? "🇷🇺" : "🇺🇿, 🇷🇺"}\n\nUstozning darsiga yozilishni istasangiz o'zingizga mos keladigan sanani tanlang. (3 ish kuni)`, parse_mode: "HTML" });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("text", auth, async (ctx) => {
    // Get current date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    try {
        const date = getDates().find((item) => item.date === ctx.message.text);

        if (date) {
            if (date.holiday) {
                ctx.reply("❗️ Biz bu sanada dam olamiz.");
            } else {
                const results = await Promise.all([Lesson.countDocuments({ user: ctx.state.user?._id, status: { $nin: ["rejected", "finished"] }, createdAt: { $gte: startOfDay } }), Lesson.countDocuments({ type: { $ne: "break" }, status: { $nin: ["rejected", "finished"] }, teacher: ctx.scene.state._id, date: date.date })]);

                if (results[0] >= maximumBookingPeerDay) throw new Error(`❗️ Bugun siz ${maximumBookingPeerDay} marta qabulga yozilgansiz, iltimos ertaga qayta uruning.`);
                if (results[1] >= maximumLessonsPeerDay) throw new Error(`❗️ ${date.date} sanada o'qituvchimizning hamma vaqti band qilingan. Iltimos boshqa o'qituvchi yoki boshqa sanani tanlang.`);

                ctx.scene.enter("booking:selectTime", { date: date.date, teacher: ctx.scene.state });
            };
        } else {
            ctx.reply("❗️ Iltimos quyida keltirilgan sanalardan tanlang.");
        };
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;