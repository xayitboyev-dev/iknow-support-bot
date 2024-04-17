const onTeacherRequestAction = require("../handlers/onTeacherRequestAction");
const { Scenes: { BaseScene } } = require("telegraf");
const { main, teacherMain } = require("../keyboards/button");
const { oneLesson } = require("../keyboards/inline");
const onLessonAction = require("../handlers/onLessonAction");
const teacherAuth = require("../middlewares/teacherAuth");
const userAuth = require("../middlewares/userAuth");
const auth = require("../middlewares/auth");
const getDates = require("../utils/getDates");
const Lesson = require("../models/Lesson");

// initializing the scene
const scene = new BaseScene("main");

// use handlers here
scene.enter(auth, (ctx) => {
    ctx.reply("🔝 Asosiy menyu", ctx.state?.user?.role == "TEACHER" ? teacherMain : main);
});

scene.use(auth);

// action for basic users
scene.hears("✏️ Ustoz darsiga yozilish", userAuth, (ctx) => {
    ctx.scene.enter("teachers");
});

// actions for teachers
scene.hears("🔖 Darslar", teacherAuth, async (ctx) => {
    const lessons = await Lesson.find({ teacher: ctx.state.user._id, status: "confirmed", date: { $in: getDates(1).map((item) => item.date) } }).populate("user");

    for (const lesson of lessons) {
        ctx.replyWithHTML(`<b>${lesson.topic}</b>\n\n👤 O'quvchi ismi: ${lesson.user.first_name || lesson.user.last_name}\n🎓 Daraja: ${lesson.user.level || "Unknown"}\n☎️ Telefon: ${lesson.user.phone || "Unknown"}\n📅 Sana: ${lesson.date}\n🕔 Vaqt: ${lesson.time}`, oneLesson(lesson._id));
    };

    if (lessons.length == 0) {
        ctx.reply("Hozircha darslar mavjud emas!");
    };
});

scene.action(/^accept_lesson_(.+)|deny_lesson_(.+)$/, onTeacherRequestAction);

scene.action(/^finish_lesson_(.+)|reject_lesson_(.+)$/, onLessonAction);

// action for basic users
scene.on("message", (ctx) => {
    ctx.reply("🔽 Kerakli bo'limni tanlang.", ctx.state?.user?.role == "TEACHER" ? teacherMain : main);
});

module.exports = scene;