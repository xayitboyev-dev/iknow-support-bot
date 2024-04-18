const { Scenes: { WizardScene } } = require('telegraf');
const { levels, empty, phone } = require("../keyboards/button");
const { requestButton } = require("../keyboards/inline");
const { needActivationRequest } = require("../config/config.json");
const User = require("../models/User");

const steps = [
    (ctx) => {
        ctx.reply("Botdan to'liq foydalanishingiz uchun siz haqingizda ozgina bilib olsam...\n\nIsm va familiyangizni kiriting.", empty);
        ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.full_name = ctx.message.text;

            ctx.reply("Ingliz tili darajangizni tanlang.", levels);
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos ism va familiyani faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.level = ctx.message.text;

            ctx.reply("iKnow academy o'quvchisi ekanligingizni tasdiqlash uchun akademiyadagi o'qituvchingizni ismini yozing.", empty);
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos darajani faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.teacher = ctx.message.text;

            ctx.reply("Telefon raqamingizni 941234567 formatida kiriting.", phone);
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos darajani faqat harflarda kiriting.");
        };
    },
    async (ctx) => {
        if (ctx.message?.text || ctx.message?.contact?.phone_number) {
            ctx.scene.state.phone = ctx.message?.contact?.phone_number && "+" + ctx.message?.contact?.phone_number || (ctx.message.text.includes("+998") ? ctx.message.text : "+998" + ctx.message.text).split(" ").join("");
            ctx.scene.state.username = ctx.from.username;
            ctx.scene.state.id = ctx.from.id;

            if (!needActivationRequest) {
                ctx.scene.state.status = "activated";
                delete ctx.scene.state.teacher;
            };

            try {
                const request = await User.create(ctx.scene.state);

                if (needActivationRequest) {
                    await ctx.telegram.sendMessage(process.env.ADMIN_CHANNEL, `<b>👤 Ism:</b> ${request.full_name}\n<b>🎓 Darajasi:</b> ${request.level}\n<b>🧑‍🏫 Ustoz:</b> ${ctx.scene.state.teacher}\n<b>☎️ Telefon:</b> ${request.phone}\n<b>👤 Telegram:</b> <a href="tg://user?id=${request.id}">${request.id}</a>\n\n🕐 #kutilmoqda`, { ...requestButton(request._id), parse_mode: "HTML" });
                    await ctx.reply("✅ Ma'lumotlaringiz yuborildi. Adminlar uni tasdiqlagandan so'ng botdan to'liq foydalanishingiz mumkin.", empty);
                } else {
                    await ctx.reply("✅ Ma'lumotlaringiz saqlandi. Endi botdan to'liq foydalanishingiz mumkin.");
                    ctx.scene.enter("main");
                };

                ctx.scene.leave();
            } catch (error) {
                ctx.reply("Error: " + error.message);
                ctx.scene.enter("main");
            };
        } else {
            ctx.reply("❗️ Iltimos telefon raqamni to'gri kiriting.");
        };
    }
];

const scene = new WizardScene('register', ...steps);

module.exports = scene;