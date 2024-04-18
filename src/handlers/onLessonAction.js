const Lesson = require("../models/Lesson");
const { rate } = require("../keyboards/inline");

module.exports = async (ctx) => {
    const data = ctx.match[0];
    const id = ctx.match[1] || ctx.match[2];

    try {
        // confirm the lesson
        if (data.startsWith("finish_lesson_")) {
            // update the lesson
            const lesson = await Lesson.findOneAndUpdate({ _id: id, status: "confirmed" }, { status: "finished" }, { new: true }).populate("user teacher");

            if (!lesson) throw new Error("Lesson not found!");

            // send the product to the user
            ctx.telegram.sendMessage(lesson.user.id, `👋 Assalomu alaykum, Ustozimiz ${lesson.teacher.first_name}ning o'tgan darsiga baho bering!`, rate(lesson.teacher._id));

            ctx.answerCbQuery("Dars tugatildi ✅", { show_alert: true });
        };

        // cancel the request
        if (data.startsWith("reject_lesson_")) {
            // update the lesson
            const lesson = await Lesson.findByIdAndUpdate(id, { status: "cancelled" }).populate("user");

            if (!lesson) throw new Error("Lesson not found!");

            ctx.answerCbQuery("Dars yopildi ⛔️", { show_alert: true });
        };
    } catch (error) {
        ctx.answerCbQuery(error.message, { show_alert: true });
    };

    // delete this message
    ctx.deleteMessage();
};