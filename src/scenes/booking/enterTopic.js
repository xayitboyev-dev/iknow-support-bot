const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('booking:enterTopic');
const { cancel } = require('../../keyboards/button');
const { teacherRequest } = require('../../keyboards/inline');
const { needTeacherRequest } = require("../../config/config.json");
const Lesson = require("../../models/Lesson");
const auth = require("../../middlewares/auth");

scene.enter(async (ctx) => {
    ctx.reply("Yaxshi, endi qaysi mavzuni tushuntirib berishini istaysiz?", cancel);
});

scene.hears("◀️ Bekor qilish", (ctx) => {
    ctx.scene.enter("teachers");
});

scene.on("text", auth, async (ctx) => {
    const topic = ctx.message.text;

    try {
        if (topic.length > 100) return ctx.reply("❗️ Mavzu eng ko'pida 100 ta harfdan iborat bo'lishi kerak.");

        const lesson = await Lesson.create({ status: needTeacherRequest ? "pending" : "confirmed", user: ctx.state.user._id, teacher: ctx.scene.state.teacher._id, date: ctx.scene.state.date, time: ctx.scene.state.time, topic });

        if (lesson?.status === "pending") {
            ctx.telegram.sendMessage(ctx.scene.state.teacher.id, `<b>🆕 O'quvchidan so'rov</b>\n\n👤 Ismi: ${ctx.state.user.first_name || ctx.state.user.last_name}\n🎓 Daraja: ${ctx.state.user.level || "Unknown"}\n📅 Sana: ${lesson.date}\n🕔 Vaqt: ${lesson.time}\n📃 Mavzu: ${lesson.topic}`, { ...teacherRequest(lesson._id), parse_mode: "HTML" });
            await ctx.reply("✅ Ustozga so'rov yuborildi, qabul qilsa sizga xabar beraman.");
        } else {
            ctx.telegram.sendMessage(ctx.scene.state.teacher.id, `<b>🆕 Yangi dars</b>\n\n👤 Ismi: ${ctx.state.user.first_name || ctx.state.user.last_name}\n🎓 Daraja: ${ctx.state.user.level || "Unknown"}\n📅 Sana: ${lesson.date}\n🕔 Vaqt: ${lesson.time}\n📃 Mavzu: ${lesson.topic}`, { parse_mode: "HTML" });
            await ctx.reply(`✅ Muvaffaqqiyatli qabulga yozildingiz. Sizni ${lesson.date} sana soat ${lesson.time} da kutib qolamiz!`);
        };

        ctx.scene.enter("main");
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

module.exports = scene;