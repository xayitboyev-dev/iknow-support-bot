const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("./main"),
    require("./register"),
    require("../admin/scenes/main"),
    require("../admin/scenes/sendMessage"),
    require("../admin/scenes/sendTo"),
    require("../admin/scenes/teachers"),
    require("../admin/scenes/teacherAdd"),
    require("../admin/scenes/teacherEdit"),
    require("../admin/scenes/teacherSingle"),
], {
    default: "main"
});

module.exports = stage;