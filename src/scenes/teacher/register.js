const { Scenes: { BaseScene } } = require("telegraf");
const { main, phone } = require("../../keyboards/button");
const User = require("../../models/User");

// initializing the scene
const scene = new BaseScene("teacher:register");

// use handlers here
scene.enter((ctx) => {
    ctx.reply("Botdan ustoz sifatida foydalanish uchun, raqamingizni quyidagi tugma orqali yuboring yoki 931234567 formatida yozing.", phone);
});

scene.on(["text", "contact"], async (ctx) => {
    const phone = ctx.message?.contact?.phone_number && "+" + ctx.message?.contact?.phone_number || (ctx.message.text.includes("+998") ? ctx.message.text : "+998" + ctx.message.text).split(" ").join("");

    try {
        const user = await User.findOne({ role: "TEACHER", phone });

        if (!ctx.message.text || parseInt(ctx.message.text)) {
            if (user) {
                await User.findByIdAndUpdate(user._id, { id: ctx.from.id }, { new: true });
                await ctx.reply("✅ Ma'lumotlaringiz to'g'ri. Botdan foydalanishingiz mumkin.");
                ctx.scene.enter("main");
            } else {
                ctx.reply("❗️ Raqamingiz bazada topilmadi.");
            };
        } else {
            ctx.reply("❗️ Iltimos raqamni faqat sonlarda kiriting");
        };
    } catch (error) {
        ctx.reply(error.code == 11000 ? "Sizning telegram accountingizdan boshqa foydalanuvchi avvalroq ro'yxatdan o'tgan!" : "Error: " + error.message);
        ctx.scene.enter("main");
    };
});

scene.on("message", (ctx) => {
    ctx.reply("Iltimos raqamni to'g'ri kiriting.", main);
});

module.exports = scene;