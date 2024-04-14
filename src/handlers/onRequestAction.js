const { main, reEnter } = require("../keyboards/button");
const Request = require("../models/Request");
const User = require("../models/User");
const bot = require("../core/bot");

module.exports = async (ctx) => {
    const data = ctx.match[0];
    const id = ctx.match[1] || ctx.match[2];

    try {
        // confirm the request
        if (data.startsWith("request_confirm_")) {
            // update the request
            const request = await Request.findByIdAndUpdate(id, { status: "confirmed" });

            if (!request) {
                return ctx.deleteMessage();
            };

            const user = await User.create(request.data);

            if (!user) throw new Error("User not created!");

            // send the product to the user
            bot.telegram.sendMessage(request.data.id, `✅ Shaxsingiz tasdiqlandi. Endi botdan to'liq foydalanishingiz mumkin.`, main);

            // update this message
            ctx.editMessageText(`<b>👤 Ism:</b> ${request.data.first_name} ${request.data.last_name}\n<b>🎓 Darajasi:</b> ${request.data.level}\n<b>🧑‍🏫 Ustoz:</b> ${request.data.level}\n<b>☎️ Telefon:</b> ${request.data.phone}\n<b>👤 Telegram:</b> <a href="tg://user?id=${request.data.id}">${request.data.first_name || request.data.last_name}</a>\n\n✅ #tasdiqlangan`, { parse_mode: "HTML" });

            ctx.answerCbQuery("Tasdiqlandi ✅");
        };

        // cancel the request
        if (data.startsWith("request_cancel_")) {
            // update the request
            const request = await Request.findByIdAndUpdate(id, { status: "cancelled" });

            // send the product to the user
            bot.telegram.sendMessage(request.data.id, `❌ Shaxsingiz aniqlanmadi va rad etildi. Iltimos ma'lumotlaringizni qaytadan to'gri kiriting. /start`, reEnter);

            // update this message
            ctx.editMessageText(`<b>👤 Ism:</b> ${request.data.first_name} ${request.data.last_name}\n<b>🎓 Darajasi:</b> ${request.data.level}\n<b>🧑‍🏫 Ustoz:</b> ${request.data.level}\n<b>☎️ Telefon:</b> ${request.data.phone}\n<b>👤 Telegram:</b> <a href="tg://user?id=${request.data.id}">${request.data.first_name || request.data.last_name}</a>\n\n❌ #radetilgan`, { parse_mode: "HTML" });

            ctx.answerCbQuery("Rad etildi ❌");
        };
    } catch (error) {
        ctx.answerCbQuery(error.message);
    };
};