const User = require("../models/User");

module.exports = async function (ctx) {
    try {
        if (ctx.myChatMember.new_chat_member.status !== "member") {
            await User.findOneAndUpdate({ id: ctx.chat.id }, { active: false });
            console.log(ctx.from.id, "is just kicked!");
        };
    } catch (error) {
        console.log(ctx.from.id, "failed on new chat member!");
    };
};