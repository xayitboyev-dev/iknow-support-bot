const Lesson = require("../models/Lesson");
const { main } = require("../keyboards/button");
const User = require("../models/User");

module.exports = async (ctx) => {
    const data = ctx.match[0];
    const id = ctx.match[1] || ctx.match[2];

    try {
        // confirm the lesson
        if (data.startsWith("accept_lesson_")) {
            // update the lesson
            const lesson = await Lesson.findByIdAndUpdate(id, { status: "confirmed" }, { new: true }).populate("user");

            if (!lesson) throw new Error("Lesson not found!");

            // send the product to the user
            ctx.telegram.sendMessage(lesson.user.id, `✅ Muvaffaqqiyatli qabulga yozildingiz. Sizni ${lesson.date} sana soat ${lesson.time} da kutib qolamiz!`, main);

            // delete this message
            ctx.deleteMessage();

            ctx.answerCbQuery("Tasdiqlandi ✅");
        };

        // cancel the request
        if (data.startsWith("deny_lesson_")) {
            // update the lesson
            const lesson = await Lesson.findByIdAndUpdate(id, { status: "rejected" }).populate("user");

            if (!lesson) throw new Error("Lesson not found!");

            await User.findByIdAndUpdate(ctx.state.user._id, { $inc: { "ratings.1": 1 } });

            // send the product to the user
            ctx.telegram.sendMessage(lesson.user.id, `⛔️ Afsuski qabulga so'rovingiz rad etildi. Boshqa ustozning qabuliga yozilishingiz mumkin!`, main);

            // delete this message
            ctx.editMessageText("⛔️ Rad etildi. Eslatib o'tamiz har bir rad etganingiz uchun reyting pasayadi!");

            ctx.answerCbQuery("Bekor qilindi ⛔️");
        };
    } catch (error) {
        ctx.answerCbQuery(error.message);
    };
};