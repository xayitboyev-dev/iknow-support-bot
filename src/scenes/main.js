const { Scenes: { BaseScene } } = require("telegraf");
const { main } = require("../keyboards/button");
const auth = require("../middlewares/auth");

// initializing the scene
const scene = new BaseScene("main");

// use handlers here
scene.enter(auth, (ctx) => {
    ctx.reply("🔝 Asosiy menyu", main);
});

scene.use(auth);

scene.on("message", (ctx) => {
    ctx.reply("🔽 Kerakli bo'limni tanlang.", main);
});

module.exports = scene;