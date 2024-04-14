const User = require("../models/User");
const Request = require("../models/Request");

module.exports = async (ctx, next) => {
    try {
        const user = await User.findOne({ id: ctx.from.id });

        if (user) {
            ctx.state.user = user;
            next();
        } else {
            const request = await Request.findOne({ userId: ctx.from.id, status: "pending" });

            if (request) {
                ctx.reply("iKnow Academy o'quvchisi ekanligingiz tekshirilganidan so'ng botdan to'liq foydalanishingiz mumkin. Iltimos kuting!");
            } else {
                ctx.scene.enter("register");
            };
        };
    } catch (error) {
        console.log("Auth middleware error:", error.message);
    };
};