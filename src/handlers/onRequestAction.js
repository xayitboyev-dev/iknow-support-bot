const { main, reEnter } = require("../keyboards/button");
const User = require("../models/User");
const bot = require("../core/bot");

module.exports = async (ctx) => {
    const data = ctx.match[0];
    const id = ctx.match[1] || ctx.match[2];

    try {
        // confirm the request
        if (data.startsWith("request_confirm_")) {
            // update the request
            const user = await User.findByIdAndUpdate(id, { status: "activated", $unset: { teacher: "" } });

            if (!user) {
                return ctx.deleteMessage();
            };

            // send the product to the user
            bot.telegram.sendMessage(user.id, `✅ Shaxsingiz tasdiqlandi. Endi botdan to'liq foydalanishingiz mumkin.`, main);

            // update this message
            ctx.editMessageText(`<b>👤 Ism:</b> ${user.full_name}\n<b>🎓 Darajasi:</b> ${user.level}\n<b>☎️ Telefon:</b> ${user.phone}\n<b>👤 Telegram:</b> <a href="tg://user?id=${user.id}">${user.full_name}</a>\n\n✅ #tasdiqlangan`, { parse_mode: "HTML" });

            ctx.answerCbQuery("Tasdiqlandi ✅");
        };

        // cancel the request
        if (data.startsWith("request_cancel_")) {
            // update the request
            const user = await User.findByIdAndDelete(id);

            if (!user) {
                return ctx.deleteMessage();
            };

            // send the product to the user
            bot.telegram.sendMessage(user.id, `❌ Shaxsingiz aniqlanmadi va rad etildi. Iltimos ma'lumotlaringizni qaytadan to'gri kiriting. /start`, reEnter);

            // update this message
            ctx.editMessageText(`<b>👤 Ism:</b> ${user.full_name}\n<b>🎓 Darajasi:</b> ${user.level}\n<b>☎️ Telefon:</b> ${user.phone}\n<b>👤 Telegram:</b> <a href="tg://user?id=${user.id}">${user.full_name}</a>\n\n❌ #radetilgan`, { parse_mode: "HTML" });

            ctx.answerCbQuery("Rad etildi ❌");
        };
    } catch (error) {
        ctx.answerCbQuery(error.message);
    };
};