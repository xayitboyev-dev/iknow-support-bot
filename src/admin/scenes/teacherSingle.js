const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:teacherSingle');
const { teacherSingle } = require('../keyboards/button');
const User = require("../../models/User");

scene.enter(async (ctx) => {
    try {
        const teacher = ctx.scene.state;

        ctx.replyWithPhoto(teacher.image, { ...teacherSingle, caption: `<b>${teacher.first_name} ${teacher.last_name}</b>\n\n🔖 IELTS Score: ${teacher.ielts}\n☎️ Telefon: ${teacher.phone}\n🟢 Status: ${teacher.active ? "active" : "inactive"}`, parse_mode: "HTML" });
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
        
        ctx.reply("✅ O'qituvchi o'chirildi.");
        ctx.scene.enter("admin:teachers");
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;