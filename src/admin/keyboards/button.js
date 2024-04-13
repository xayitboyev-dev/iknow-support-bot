const { Markup } = require('telegraf');

exports.main = Markup.keyboard([
    ["📤 Xabar tarqatish", "📊 Statistika"],
    ["👤 Userga xabar", "🏠 Client"]
]).resize();

exports.cancel = Markup.keyboard([
    ["🔙 Bekor qilish"]
]);