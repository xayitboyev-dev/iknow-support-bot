const { Scenes: { BaseScene } } = require("telegraf");
const { main } = require("../keyboards/button");

// initializing the scene
const scene = new BaseScene("main");

// use handlers here
scene.enter((ctx) => {
    ctx.reply("🔝 Asosiy menyu", main);
});

scene.hears("Example Scene", (ctx) => {
    ctx.scene.enter("example");
});

scene.on("message", (ctx) => {
    ctx.reply("🔽 Kerakli bo'limni tanlang.", main);
});

module.exports = scene;