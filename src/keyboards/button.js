const { Markup } = require("telegraf");

exports.main = Markup.keyboard([
    ["Example Scene"]
]).resize();

exports.example = Markup.keyboard([
    ["Go back"]
]).resize();