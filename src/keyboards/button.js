const { Markup } = require("telegraf");
const { times, levels } = require("../config/config.json");
const getDates = require("../utils/getDates");

exports.main = Markup.keyboard([
    ["✏️ Darsga yozilish", "🔖 Darslar"],
    ["⚙️ Sozlamalar"]
]).resize();

exports.userSettings = Markup.keyboard([
    ["✏️ Ismni tahrirlash"],
    ["☎️ Telefonni yangilash", "🎓 Darajani yangilash"],
    ["⏪ Orqaga"]
]).resize();

exports.teacherSettings = Markup.keyboard([
    ["✏️ Ismni tahrirlash", "☎️ Telefonni yangilash"],
    ["⏪ Orqaga"]
]).resize();

exports.settingsUpdateLevel = Markup.keyboard([
    ...levels,
    "◀️ Bekor qilish"
]).resize();

exports.settingsUpdatePhone = Markup.keyboard([
    Markup.button.contactRequest("☎️ Telefon raqamni yuborish"),
    "◀️ Bekor qilish"
]).resize();

exports.splash = Markup.keyboard([
    "📲 Ro'yxatdan o'tish"
]).resize();

exports.teacherMain = Markup.keyboard([
    "🔖 Qabul qilingan darslar",
    "⚙️ Sozlamalar"
]).resize();

exports.teachers = (teachers) => Markup.keyboard([
    ["⏪ Orqaga"],
    ...teachers.map((item) => [item.name]),
]).resize();

exports.singleTeacher = () => Markup.keyboard([
    getDates().map(item => item.date),
    ["◀️ Bekor qilish"]
]).resize();

exports.selectTime = (lessons) => {
    const buttons = [["◀️ Bekor qilish"]];
    let row = [];

    times.forEach((time, index) => {
        row.push(lessons.find(item => item.time === time) ? `${time} 🔴` : `${time} 🟡`);

        if (row.length >= 3 || index === times.length - 1) {
            buttons.unshift(row);
            row = [];
        };
    });

    return Markup.keyboard(buttons).resize();
};

exports.cancel = Markup.keyboard([
    "◀️ Bekor qilish",
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

exports.levels = Markup.keyboard(levels).resize();

exports.review = Markup.keyboard([
    ["Tashlab ketish ➡️"]
]).resize();