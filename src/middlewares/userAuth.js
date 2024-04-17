module.exports = async (ctx, next) => {
    if (["USER", "ADMIN"].includes(ctx.state?.user?.role)) {
        next();
    } else {
        ctx.reply("Only students can use the command!");
    };
};