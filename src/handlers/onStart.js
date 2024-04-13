const { main } = require("../keyboards/button");
const User = require("../models/User");

module.exports = async (ctx) => {
    ctx.reply("Hello world!", main);

    try {
        // create new user in the database
        await User.create({ ...ctx.chat, active: true });
    } catch (error) {
        // update if the user already exists in the database
        await User.findOneAndUpdate({ id: ctx.chat.id }, { ...ctx.chat, active: true });
    };
};