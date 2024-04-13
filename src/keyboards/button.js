const { Markup } = require("telegraf");

exports.main = Markup.keyboard([
    "✏️ O'qituvchiga ariza qoldirish",
    "⚙️ Sozlamalar"
]).resize();

exports.example = Markup.keyboard([
    "Go back",
]).resize();