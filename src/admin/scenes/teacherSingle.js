const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:teacherSingle');
const { teacherSingle } = require('../keyboards/button');
const User = require("../../models/User");
const Lesson = require("../../models/Lesson");
const getRating = require('../../utils/getRating');

scene.enter(async (ctx) => {
    try {
        const teacher = ctx.scene.state;

        // get info
        const results = await Promise.all([Lesson.count({ teacher: teacher._id, status: "finished" }), Lesson.count({ teacher: teacher._id, status: "cancelled" }), Lesson.count({ teacher: teacher._id, status: "rejected" })]);

        ctx.replyWithPhoto(teacher.image, { ...teacherSingle, caption: `<b>${teacher.full_name}</b>\n\n🔖 IELTS Score: ${teacher.ielts}\n☎️ Telefon: ${teacher.phone}\n🏫 Filial: ${teacher.branch}\n⭐️ Reyting: ${getRating(teacher.ratings)}\n🟢 Status: ${teacher.active ? "active" : "inactive"}\n\nO'tilgan darslar: ${results[0]}\nRad etilgan darslar: ${results[1]}\nBekor qilingan darslar: ${results[2]}`, parse_mode: "HTML" });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.hears("◀️ Orqaga", (ctx) => {
    ctx.scene.enter("admin:teachers");
});

scene.hears("✏️ Tahrirlash", (ctx) => {
    ctx.scene.enter("admin:teacherEdit", { teacher: ctx.scene.state });
});

scene.hears("🗑 O'chirish", async (ctx) => {
    try {
        await User.findByIdAndDelete(ctx.scene.state._id);
        await Lesson.deleteMany({ teacher: ctx.scene.state._id });

        ctx.reply("✅ Ustoz o'chirildi.");
        ctx.scene.enter("admin:teachers");
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;