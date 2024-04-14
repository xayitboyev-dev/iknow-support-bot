const { Markup } = require("telegraf");

exports.requestButton = (id) => Markup.inlineKeyboard([
    Markup.button.callback("✅ Tasdiqlash", "request_confirm_" + id),
    Markup.button.callback("❌ Bekor qilish", "request_cancel_" + id),
]);