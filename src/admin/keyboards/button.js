const { Markup } = require('telegraf');

exports.main = Markup.keyboard([
    ["📤 Xabar tarqatish", "👤 Userga xabar"],
    ["🧑‍🏫 Ustozlar"],
    ["📊 Statistika", "🏠 Client"]
]).resize();

exports.teachers = (teachers) => Markup.keyboard([
    ["🆕 Yangi qo'shish", "🔙 Bekor qilish"],
    ...teachers.map((item) => [item.name])
]).resize();

exports.teacherSingle = Markup.keyboard([
    ["✏️ Tahrirlash", "🗑 O'chirish"],
    ["◀️ Orqaga"]
]).resize();

exports.cancel = Markup.keyboard([
    ["🔙 Bekor qilish"]
]).resize();

exports.empty = Markup.removeKeyboard();