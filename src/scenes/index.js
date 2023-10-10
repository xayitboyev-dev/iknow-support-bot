const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("./main"),
    require("./example"),
], {
    default: "main"
});

module.exports = stage;