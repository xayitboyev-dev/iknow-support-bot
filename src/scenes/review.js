const { Scenes: { BaseScene } } = require("telegraf");
const { review } = require("../keyboards/button");
const auth = require("../middlewares/auth");
const User = require("../models/User");

// initializing the scene
const scene = new BaseScene("review");

// use handlers here
scene.enter(auth, async (ctx) => {
    ctx.scene.state.enterMsg = await ctx.replyWithHTML("📝 Yaxshi, endi dars qanday bo'lganligi haqida izohingizni qoldiring!", review);

    // set timer for auto end the task
    ctx.scene.state.timer = setTimeout(async () => {
        try {
            // save rating
            await User.findByIdAndUpdate(ctx.scene.state.teacherId, { $inc: { ["ratings." + ctx.scene.state.rate]: 1 } });

            // delete enter message and reply thanks
            ctx.telegram.deleteMessage(ctx.scene.state.enterMsg.chat.id, ctx.scene.state.enterMsg.message_id);
            ctx.reply("😉 Bahoyingiz uchun rahmat!");
        } catch (error) {
            console.log(error.message);
        };

        ctx.scene.enter("main");
    }, 100000);
});

scene.on("text", auth, async (ctx) => {
    let review;

    // set review if user doesn't skip comment
    if (ctx.message.text != "Tashlab ketish ➡️") review = ctx.message.text;

    try {
        // save rating
        const teacher = await User.findByIdAndUpdate(ctx.scene.state.teacherId, { $inc: { ["ratings." + ctx.scene.state.rate]: 1 } });

        // clear auto end the task timer
        clearTimeout(ctx.scene.state.timer);

        if (review) {
            ctx.telegram.sendMessage(process.env.COMMENTS_CHANNEL, `#comment\n\n🧑‍🏫 Teacher: ${teacher.full_name}\n🎓 Student: ${ctx.state.user.full_name}\n⭐ Rate: ${ctx.scene.state.rate}\n\n<i>${review}</i>`, { parse_mode: "HTML" });
        };

        // delete enter message and reply thanks
        ctx.telegram.deleteMessage(ctx.scene.state.enterMsg.chat.id, ctx.scene.state.enterMsg.message_id);
        ctx.reply("😉 Bahoyingiz uchun rahmat!");

        ctx.scene.enter("main");
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;