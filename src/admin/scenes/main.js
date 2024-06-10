const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:main');
const { main } = require('../keyboards/button');
const auth = require("../middlewares/auth");
const User = require("../../models/User");
const Lesson = require("../../models/Lesson");

scene.enter(auth, (ctx) => {
    ctx.reply('🔝 Admin paneldasiz', main);
});

scene.hears("📤 Xabar tarqatish", (ctx) => {
    ctx.scene.enter('admin:sendMessage', { type: "all" });
});

scene.hears("👤 Userga xabar", (ctx) => {
    ctx.scene.enter('admin:sendTo');
});

scene.hears("🧑‍🏫 Ustozlar", (ctx) => {
    ctx.scene.enter('admin:teachers');
});

scene.hears("📊 Statistika", async (ctx) => {
    const activeUsers = await User.count({ active: true });
    const nonActiveUsers = await User.count({ active: false });

    // get info
    const results = await Promise.all([Lesson.count({ status: "finished" }), Lesson.count({ status: "cancelled" }), Lesson.count({ status: "rejected" })]);

    ctx.replyWithHTML(`📊 Statistika\n\nActive userlar: <b>${activeUsers}</b>\nNonActive userlar: <b>${nonActiveUsers
        
    }</b>\nBarchasi: <b>${activeUsers + nonActiveUsers}</b>\n\nO'tilgan darslar: ${results[0]}\nRad etilgan darslar: ${results[1]}\nBekor qilingan darslar: ${results[2]}`);
});

\n\nO'tilgan darslar: ${results[0]}\nRad etilgan darslar: ${results[1]}\nBekor qilingan darslar: ${results[2]}scene.hears("🏠 Client", (ctx) => ctx.scene.enter("main"));

module.exports = scene;