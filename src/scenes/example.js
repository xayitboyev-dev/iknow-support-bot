const { Scenes: { BaseScene } } = require("telegraf");
const { example } = require("../keyboards/button");

// initializing the scene
const scene = new BaseScene("example");

// use handlers here
scene.enter((ctx) => {
    ctx.reply("This is example scene!", example);
});

scene.hears("Go back", (ctx) => {
    ctx.scene.enter("main");
});

module.exports = scene;