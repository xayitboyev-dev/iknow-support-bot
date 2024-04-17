const User = require("../models/User");

module.exports = async (ctx) => {
    const teacherId = ctx.match[1];
    const score = ctx.match[2];
    const field = "ratings." + score;

    try {
        await User.findOneAndUpdate({ role: "TEACHER", _id: teacherId }, { $inc: { [field]: 1 } });
        ctx.reply("😉 Bahoyingiz uchun rahmat!");
    } catch (error) {
        ctx.reply(error.message);
    };

    ctx.deleteMessage();
};