module.exports = async (ctx, next) => {
    if (ctx.state?.user?.role == "TEACHER") {
        next();
    } else {
        ctx.reply("Only teachers can use the command!");
    };
};