module.exports = async (ctx) => {
    ctx.reply("Assalomu alaykum!");
    ctx.scene.enter("main");

    // try {
    //     // create new user in the database
    //     await User.create({ ...ctx.chat, active: true });
    // } catch (error) {
    //     // update if the user already exists in the database
    //     await User.findOneAndUpdate({ id: ctx.chat.id }, { ...ctx.chat, active: true });
    // };
};