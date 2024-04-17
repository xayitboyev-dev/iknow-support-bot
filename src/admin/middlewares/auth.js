const User = require('../../models/User');

module.exports = async (ctx, next) => {
    try {
        const user = await User.findOne({ id: ctx.from.id, role: "ADMIN" });

        if (user) next();
        else await ctx.scene.enter("main");
    } catch (error) {
        console.log(error);
    };
};