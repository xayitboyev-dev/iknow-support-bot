const { Markup } = require("telegraf");

exports.requestButton = (id) => Markup.inlineKeyboard([
    Markup.button.callback("✅ Tasdiqlash", "request_confirm_" + id),
    Markup.button.callback("❌ Rad etish", "request_cancel_" + id),
]);

exports.teacherRequest = (id) => Markup.inlineKeyboard([
    Markup.button.callback("✅ Qabul qilish", "accept_lesson_" + id),
    Markup.button.callback("❌ Rad etish", "deny_lesson_" + id),
]);

exports.oneLesson = (id) => Markup.inlineKeyboard([
    Markup.button.callback("✅ Dars o'tildi", "finish_lesson_" + id),
    Markup.button.callback("❌ O'quvchi kelmadi", "reject_lesson_" + id),
]);

exports.deleteLesson = (id) => Markup.inlineKeyboard([
    Markup.button.callback("❌ Darsni bekor qilish", "delete_lesson_" + id),
]);

exports.rate = (teacherId) => Markup.inlineKeyboard([
    [Markup.button.callback("⭐ 1", `rate_${teacherId}_1`), Markup.button.callback("⭐ 2", `rate_${teacherId}_2`), Markup.button.callback("⭐ 3", `rate_${teacherId}_3`), Markup.button.callback("⭐ 4", `rate_${teacherId}_4`), Markup.button.callback("⭐ 5", `rate_${teacherId}_5`)],
]);