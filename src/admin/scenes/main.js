const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:main');
const { main } = require('../keyboards/button');
const auth = require("../middlewares/auth");
const User = require("../../models/User");

scene.enter(auth, (ctx) => {
    ctx.reply('🔝 Admin paneldasiz', main);
});

scene.hears("📤 Xabar tarqatish", (ctx) => {
    ctx.scene.enter('admin:sendMessage', { type: "all" });
});

scene.hears("👤 Userga xabar", (ctx) => {
    ctx.scene.enter('admin:sendTo');
});

scene.hears("📊 Statistika", async (ctx) => {
    const activeUsers = await User.count({ active: true });
    const nonActiveUsers = await User.count({ active: false });

    ctx.replyWithHTML(`📊 Statistika\n\nActive userlar: <b>${activeUsers}</b>\nNonActive userlar: <b>${nonActiveUsers}</b>\nBarchasi: <b>${activeUsers + nonActiveUsers}</b>`);
});

scene.hears("🏠 Client", (ctx) => ctx.scene.enter("main"));

module.exports = scene;