const { Markup } = require("telegraf");
const { times } = require("../config/config.json");
const getDates = require("../utils/getDates");

exports.main = Markup.keyboard([
    "✏️ O'qituvchiga ariza qoldirish",
    "⚙️ Sozlamalar"
]).resize();

exports.teachers = (teachers) => Markup.keyboard([
    ["⏪ Orqaga"],
    ...teachers.map((item) => [item.name])
]).resize();

exports.singleTeacher = () => {
    return Markup.keyboard([["◀️ Orqaga"], getDates()]);
};

exports.selectTime = (lessons) => {
    return Markup.keyboard(["◀️ Orqaga", ...times.map((item) => lessons.find((lesson) => lesson.time == item) ? item + " 🔴" : item + " 🟡")]);
};

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