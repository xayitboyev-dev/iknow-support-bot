const { Markup } = require("telegraf");

exports.main = Markup.keyboard([
    "✏️ O'qituvchiga ariza qoldirish",
    "⚙️ Sozlamalar"
]).resize();

exports.back = Markup.keyboard([
    "◀️ Orqaga",
]).resize();

exports.reEnter = Markup.keyboard([
    "📲 Qayta kiritish",
]).resize();

exports.backMain = Markup.keyboard([
    "⏪ Orqaga",
]).resize();

exports.empty = Markup.removeKeyboard();

exports.phone = Markup.keyboard([
    Markup.button.contactRequest("☎️ Telefon raqamni yuborish")
]).resize();

exports.levels = Markup.keyboard([
    "Beginner",
    "Elementary",
    "Pre-Intermediate",
    "Intermediate",
    "Pre-IELTS",
    "IELTS",
]).resize();