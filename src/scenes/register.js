const { Scenes: { WizardScene } } = require('telegraf');
const { levels, empty, phone } = require("../keyboards/button");
const { requestButton } = require("../keyboards/inline");
const Request = require("../models/Request");

const steps = [
    (ctx) => {
        ctx.reply("Botdan to'liq foydalanishingiz uchun siz haqingizda ozgina bilib olsam...\n\nIsmingizni kiriting.", empty);
        ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.first_name = ctx.message.text;

            ctx.reply("Familiyangizni kiriting.");
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos ismni faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.last_name = ctx.message.text;

            ctx.reply("Ingliz tili darajangizni tanlang.", levels);
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos familiyani faqat harflarda kiriting.");
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

            ctx.reply("Telefon raqamingizni quyida berilgan tugma orqali yuboring yoki o'zingiz 941234567 formatida kiriting.", phone);
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos darajani faqat harflarda kiriting.");
        };
    },
    async (ctx) => {
        if (ctx.message?.text || ctx.message?.contact?.phone_number) {
            ctx.scene.state.phone = ctx.message?.contact?.phone_number && "+" + ctx.message?.contact?.phone_number || (ctx.message.text.includes("+998") ? ctx.message.text : "+998" + ctx.message.text).split(" ").join("");
            ctx.scene.state.id = ctx.from.id;

            try {
                const request = await Request.create({ userId: ctx.from.id, data: ctx.scene.state });
                await ctx.telegram.sendMessage(process.env.ADMIN_CHANNEL, `<b>👤 Ism:</b> ${request.data.first_name} ${request.data.last_name}\n<b>🎓 Darajasi:</b> ${request.data.level}\n<b>🧑‍🏫 Ustoz:</b> ${request.data.level}\n<b>☎️ Telefon:</b> ${request.data.phone}\n<b>👤 Telegram:</b> <a href="tg://user?id=${request.data.id}">${request.data.first_name || request.data.last_name}</a>\n\n🕐 #kutilmoqda`, { ...requestButton(request._id), parse_mode: "HTML" });
                await ctx.reply("✅ Ma'lumotlaringiz yuborildi. Adminlar uni tasdiqlagandan so'ng botdan to'liq foydalanishingiz mumkin.");
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