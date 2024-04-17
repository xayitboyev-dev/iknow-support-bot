module.exports = async (ctx) => {
    if (ctx.startPayload) {
        ctx.scene.enter("teacher:register");
    } else {
        ctx.reply("Assalomu alaykum!");
        ctx.scene.enter("main");
    };
};