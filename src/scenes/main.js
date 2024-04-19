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
const onStart = require("../handlers/onStart");

// initializing the scene
const scene = new BaseScene("main");

// use handlers here
scene.enter(auth, (ctx) => {
    ctx.reply("🔝 Asosiy menyu", ctx.state?.user?.role == "TEACHER" ? teacherMain : main);
});

scene.start(onStart);

scene.use(auth);

scene.hears("⚙️ Sozlamalar", (ctx) => {
    ctx.scene.enter("settings", ctx.state.user);
});

// action for basic users
scene.hears("✏️ Darsga yozilish", userAuth, (ctx) => {
    ctx.scene.enter("teachers");
});

scene.hears("🔖 Darslar", userAuth, async (ctx) => {
    try {
        const lessons = await Lesson.find({ user: ctx.state.user._id, status: "confirmed", date: { $in: getDates(1).map((item) => item.date) } }).populate("teacher");

        if (lessons.length == 0) {
            return ctx.reply("Hozircha darslar mavjud emas!");
        };

        lessons.forEach((lesson) => {
            ctx.replyWithHTML(`🧑‍🏫 Ustoz ismi: ${lesson.teacher.full_name}\n☎️ Telefon: ${lesson.teacher.phone || "Unknown"}\n🏫 Filial: ${lesson.teacher.branch}\n📅 Sana: ${lesson.date}\n🕔 Vaqt: ${lesson.time}\n📃 Mavzu: ${lesson.topic}\n\nUshbu darsda sizni kutib qolamiz 😊`, deleteLesson(lesson._id));
        });
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

// actions for teachers
scene.hears("🔖 Qabul qilingan darslar", teacherAuth, async (ctx) => {
    try {
        const lessons = await Lesson.find({ teacher: ctx.state.user._id, status: "confirmed", date: { $in: getDates(1).map((item) => item.date) } }).populate("user");

        if (lessons.length == 0) {
            return ctx.reply("Hozircha darslar mavjud emas!");
        };

        lessons.forEach((lesson) => {
            ctx.replyWithHTML(`👤 O'quvchi ismi: ${lesson.user.full_name}\n🎓 Daraja: ${lesson.user.level || "Unknown"}\n☎️ Telefon: ${lesson.user.phone || "Unknown"}\n📅 Sana: ${lesson.date}\n🕔 Vaqt: ${lesson.time}\n📃 Mavzu: ${lesson.topic}`, oneLesson(lesson._id));
        });
    } catch (error) {
        ctx.reply("Error: " + error.message);
    };
});

// action for basic users
scene.on("message", (ctx) => {
    ctx.reply("🔽 Kerakli bo'limni tanlang.", ctx.state?.user?.role == "TEACHER" ? teacherMain : main);
});

module.exports = scene;