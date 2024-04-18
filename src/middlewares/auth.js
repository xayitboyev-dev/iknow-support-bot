const User = require("../models/User");

module.exports = async (ctx, next) => {
    try {
        const user = await User.findOne({ id: ctx.from.id, });

        if (user) {
            if (user.status == "activated" || user.role != "USER") {
                ctx.state.user = user;
                next();
            } else {
                ctx.reply("iKnow Academy o'quvchisi ekanligingiz tekshirilganidan so'ng botdan to'liq foydalanishingiz mumkin. Iltimos kuting!");
            };
        } else {
            ctx.scene.leave();
            ctx.scene.enter("splash");
        };
    } catch (error) {
        console.log("Auth middleware error:", error.message);
    };
};