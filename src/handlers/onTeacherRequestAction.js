const Lesson = require("../models/Lesson");

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
            ctx.telegram.sendMessage(lesson.user.id, `✅ Muvaffaqqiyatli qabulga yozildingiz. Sizni ${lesson.date} sana soat ${lesson.time} da kutib qolamiz!`);

            // delete this message
            ctx.editMessageText(`✅ Qabul qilindi, Iltimos ${lesson.date} - ${lesson.time} dagi darsingizni o'z vaqtida o'tib bering.`);

            ctx.answerCbQuery("Tasdiqlandi ✅");
        };

        // cancel the request
        if (data.startsWith("deny_lesson_")) {
            // update the lesson
            const lesson = await Lesson.findByIdAndUpdate(id, { status: "rejected" }).populate("user");

            if (!lesson) throw new Error("Lesson not found!");

            // await User.findByIdAndUpdate(ctx.state.user._id, { $inc: { "ratings.1": 1 } }); // Rating downgrade

            // send the product to the user
            ctx.telegram.sendMessage(lesson.user.id, `⛔️ Afsuski qabulga so'rovingiz rad etildi. Boshqa ustozning qabuliga yozilishingiz mumkin!`);

            // delete this message
            ctx.editMessageText("⛔️ Rad etildi.");

            ctx.answerCbQuery("Bekor qilindi ⛔️");

            ctx.scene.enter("message", { text: "📝 Darsni nega rad etganingiz haqida o'quvchiga xabar qoldiring.", chatId: lesson.user.id });
        };
    } catch (error) {
        ctx.answerCbQuery(error.message);
    };
};