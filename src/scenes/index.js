const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("./main"),
    require("./example"),
    require("../admin/scenes/main"),
    require("../admin/scenes/sendMessage"),
    require("../admin/scenes/sendTo"),
], {
    default: "main"
});

module.exports = stage;