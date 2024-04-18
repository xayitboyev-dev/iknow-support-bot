module.exports = async (ctx, next) => {
    await ctx.reply("👋 Assalomu alaykum!");

    if (ctx?.startPayload == "teacher") {
        ctx.scene.enter("teacher:register");
    } else {
        ctx.scene.enter("main");
    };
};