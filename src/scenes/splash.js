const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('splash');
const { splash } = require('../keyboards/button');

scene.enter(async (ctx) => {
    ctx.reply("Support botimizdan to'liq foydalanishingiz uchun ro'yxatdan o'tishingiz kerak.", splash);
});

scene.hears("📲 Ro'yxatdan o'tish", (ctx) => {
    ctx.scene.enter("register");
});

scene.on("message", (ctx) => {
    ctx.reply("Ro'yxatdan o'tish uchun quyidagi tugmani bosing.", splash);
});

module.exports = scene;