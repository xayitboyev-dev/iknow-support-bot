const { Scenes: { BaseScene } } = require('telegraf');
const { cancel } = require('../keyboards/button');
const scene = new BaseScene('admin:sendMessage');
const User = require('../../models/User');
const auth = require('../middlewares/auth');

scene.enter(auth, async (ctx) => {
    await ctx.reply("📝 Xabaringizni yuboring:", cancel);
});

scene.on('message', async (ctx) => {
    if (ctx.scene.state.type == 'all') {
        let totalSents = 0;
        const users = await User.find({ active: true });

        if (users.length) {
            for await (const item of users) {
                try {
                    await ctx.copyMessage(item.id);
                    totalSents++;
                } catch (err) {
                    // console.log(err.message);
                };
            };
        };

        await ctx.reply(`✅ ${totalSents} kishiga xabar yuborildi`);
        await ctx.reply("📝 Yana yozishingiz mumkin:", cancel);
    } else {
        try {
            await ctx.copyMessage(ctx.scene.state.id);
            await ctx.reply('✅ Xabar yuborildi');
            await ctx.reply("📝 Yana yozishingiz mumkin:", cancel);
        } catch (err) {
            await ctx.reply(err.description);
        };
    };
});

module.exports = scene;