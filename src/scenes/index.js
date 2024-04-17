const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("./main"),
    require("./register"),
    require("./teachers"),
    require("./teacher/register"),
    require("./booking/selectTime"),
    require("./booking/enterTopic"),
    require("./booking/teacherSingle"),
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