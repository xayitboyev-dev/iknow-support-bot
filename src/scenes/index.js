const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("./main"),
    require("./splash"),
    require("./review"),
    require("./settings"),
    require("./settings/editName"),
    require("./settings/updateLevel"),
    require("./settings/updatePhone"),
    require("./register"),
    require("./teachers"),
    require("./teacher/register"),
    require("./booking/selectTime"),
    require("./booking/enterTopic"),
    require("./booking/selectBranch"),
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