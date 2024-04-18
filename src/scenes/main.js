const onTeacherRequestAction = require("../handlers/onTeacherRequestAction");
const { Scenes: { BaseScene } } = require("telegraf");
const onDeleteLessonAction = require("../handlers/onDeleteLessonAction");
const { main, teacherMain } = require("../keyboards/button");
const { oneLesson, deleteLesson } = require("../keyboards/inline");
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
scene.hears("✏️ Darsga yozilish", userAuth, (ctx) => {
    ctx.scene.enter("teachers");
});

scene.hears("🔖 Qabullar", userAuth, async (ctx) => {
    try {
        const lessons = await Lesson.find({ user: ctx.state.user._id, status: "confirmed", date: { $in: getDates(1).map((item) => item.date) } }).populate("teacher");

        if (lessons.length == 0) {
            return ctx.reply("Hozircha darslar mavjud emas!");
        };

        lessons.forEach((lesson) => {
            ctx.replyWithHTML(`🧑‍🏫 Ustoz ismi: ${lesson.teacher.first_name || lesson.teacher.last_name}\n☎️ Telefon: ${lesson.teacher.phone || "Unknown"}\n📅 Sana: ${lesson.date}\n🕔 Vaqt: ${lesson.time}\n📃 Mavzu: ${lesson.topic}\n\nUshbu darsda sizni kutib qolamiz 😊`, deleteLesson(lesson._id));
        });
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

scene.action(/^delete_lesson_(.+)$/, userAuth, onDeleteLessonAction);

// actions for teachers
scene.hears("🔖 Darslar", teacherAuth, async (ctx) => {
    try {
        const lessons = await Lesson.find({ teacher: ctx.state.user._id, status: "confirmed", date: { $in: getDates(1).map((item) => item.date) } }).populate("user");

        if (lessons.length == 0) {
            return ctx.reply("Hozircha darslar mavjud emas!");
        };

        lessons.forEach((lesson) => {
            ctx.replyWithHTML(`👤 O'quvchi ismi: ${lesson.user.first_name || lesson.user.last_name}\n🎓 Daraja: ${lesson.user.level || "Unknown"}\n☎️ Telefon: ${lesson.user.phone || "Unknown"}\n📅 Sana: ${lesson.date}\n🕔 Vaqt: ${lesson.time}\n📃 Mavzu: ${lesson.topic}`, oneLesson(lesson._id));
        });
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

scene.action(/^accept_lesson_(.+)|deny_lesson_(.+)$/, teacherAuth, onTeacherRequestAction);

scene.action(/^finish_lesson_(.+)|reject_lesson_(.+)$/, teacherAuth, onLessonAction);

// action for basic users
scene.on("message", (ctx) => {
    ctx.reply("🔽 Kerakli bo'limni tanlang.", ctx.state?.user?.role == "TEACHER" ? teacherMain : main);
});

module.exports = scene;