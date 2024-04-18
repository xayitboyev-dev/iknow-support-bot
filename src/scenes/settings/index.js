const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('settings');
const { userSettings, teacherSettings } = require('../../keyboards/button');
const getRating = require("../../utils/getRating");

scene.enter(async (ctx) => {
    const text = `${ctx.scene.state.role !== "TEACHER" && `👤 Sizning ma'lumotlaringiz:\n\n` || ""}To'liq ism: ${ctx.scene.state.full_name}\n${ctx.scene.state.role == "TEACHER" ? `Filial: ${ctx.scene.state.branch}\n${`Reyting: ⭐️${getRating(ctx.scene.state.ratings)}`}` : `Darajangiz: ${ctx.scene.state.level}`}\nTelefon: ${ctx.scene.state.phone}`;
    const keyboard = ctx.scene.state.role == "TEACHER" ? teacherSettings : userSettings;

    if (ctx.scene.state.role === "TEACHER") {
        ctx.replyWithPhoto(ctx.scene.state.image, { caption: text, ...keyboard });
    } else {
        ctx.reply(text, keyboard);
    };
});

scene.hears("✏️ Ismni tahrirlash", (ctx) => {
    ctx.scene.enter("settings:editName", ctx.scene.state);
});

scene.hears("☎️ Telefonni yangilash", (ctx) => {
    ctx.scene.enter("settings:updatePhone", ctx.scene.state);
});

scene.hears("🎓 Darajani yangilash", (ctx) => {
    ctx.scene.enter("settings:updateLevel", ctx.scene.state);
});

module.exports = scene;