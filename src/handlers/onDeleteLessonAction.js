const Lesson = require("../models/Lesson");

module.exports = async (ctx) => {
    const id = ctx.match[1];

    try {
        // delete the lesson
        const lesson = await Lesson.findOneAndDelete({ _id: id, status: "confirmed" }).populate("teacher");

        if (!lesson) throw new Error("Lesson not found!");

        // send a message about deletion to the teacher
        ctx.telegram.sendMessage(lesson.teacher.id, `❗️ ${lesson.date} sana soat ${lesson.time} dagi darsingiz o'quvchi tomonidan bekor qilindi!`);

        ctx.answerCbQuery("Dars bekor qilindi ✅", { show_alert: true });
    } catch (error) {
        ctx.answerCbQuery(error.message, { show_alert: true });
    };

    // delete this message
    ctx.deleteMessage();
};