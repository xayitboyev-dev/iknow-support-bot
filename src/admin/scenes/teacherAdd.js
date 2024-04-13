const { Scenes: { WizardScene } } = require('telegraf');
const User = require("../../models/User");
const { cancel } = require("../../keyboards/button");

const steps = [
    (ctx) => {
        ctx.reply("Ism kiriting.", cancel);
        ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.first_name = ctx.message.text;

            ctx.reply("Familiya kiriting.");
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos ismni faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.last_name = ctx.message.text;

            ctx.reply("Ielts score kiriting. (example: 7.5)");
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos familiyani faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        const score = +ctx.message?.text;

        if (score) {
            if (score > 9) return ctx.reply("❗️ Ielts score eng ko'pida 9 bo'lishi mumkin.");
            if (score < 1) return ctx.reply("❗️ Ielts score eng kamida 1 bo'lishi mumkin.");

            ctx.scene.state.ielts = score;

            ctx.reply("Telefon raqamini yuboring. (example: 931234567)");
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos ielts scoreni faqat sonlarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.phone = "+998" + ctx.message.text.split(" ").join("");

            ctx.reply("Ustoz rasmini yuboring.");
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos telefon raqamni faqat sonlarda kiriting.");
        };
    },
    async (ctx) => {
        if (ctx.message?.photo && ctx.message.photo.length > 0) {
            ctx.scene.state.image = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            ctx.scene.state.role = "TEACHER";

            // save the new product on the database!
            try {
                await User.create(ctx.scene.state);

                ctx.reply("✅ O'qituvchi qo'shildi.");
                ctx.scene.enter("admin:main");
            } catch (error) {
                ctx.reply(error.message);
            };
        } else {
            ctx.reply('❗️ Iltimos faqat rasm yuboring.');
        };
    }
];

const scene = new WizardScene('admin:teacherAdd', ...steps);

module.exports = scene;
