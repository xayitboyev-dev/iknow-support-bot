const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('teacher:break:selectDate');
const { singleTeacher } = require('../../../keyboards/button');
const getDates = require("../../../utils/getDates");
const auth = require("../../../middlewares/auth");

scene.enter((ctx) => {
    ctx.reply("Kerakli sanani tanlang.", singleTeacher());
});

scene.on("text", auth, async (ctx) => {
    try {
        const date = getDates().find((item) => item.date === ctx.message.text);

        if (date) {
            if (date.holiday) {
                ctx.reply("❗️ Bu sanada dam olasiz.");
            } else {
                ctx.scene.enter("teacher:break:selectTime", { date: date.date, teacher: ctx.state.user });
            };
        } else {
            ctx.reply("❗️ Iltimos quyida keltirilgan sanalardan tanlang.");
        };
    } catch (error) {
        ctx.reply(error.message);
    };
});

module.exports = scene;