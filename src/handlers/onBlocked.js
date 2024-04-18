const User = require("../models/User");

module.exports = async function (ctx) {
    try {
        await User.findOneAndUpdate({ id: ctx.chat.id }, { active: ctx.myChatMember.new_chat_member.status === "member" });
        console.log(ctx.from.id, "is just " + ctx.myChatMember.new_chat_member.status);
    } catch (error) {
        console.log(ctx.from.id, "failed on new chat member!");
    };
};