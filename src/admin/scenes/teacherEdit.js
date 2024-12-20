const { Scenes: { WizardScene }, Markup } = require('telegraf');
const User = require("../../models/User");
const { languages } = require("../../config/config.json");

const steps = [
    (ctx) => {
        ctx.reply("Ism va familiya kiriting.", Markup.keyboard([ctx.scene.state.teacher.full_name]).resize());
        ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.full_name = ctx.message.text;

            ctx.reply("Tilini tanlang.", Markup.keyboard(languages).resize());
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos ism va familiyani faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.language = ctx.message.text;

            ctx.reply("Ielts score kiriting. (example: 7.5)", Markup.keyboard([ctx.scene.state.teacher.ielts]).resize());
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos tilni quyidagi tugmalardan tanlang.");
        };
    },
    (ctx) => {
        const score = +ctx.message?.text;

        if (score) {
            if (score > 9) return ctx.reply("❗️ Ielts score eng ko'pida 9 bo'lishi mumkin.");
            if (score < 1) return ctx.reply("❗️ Ielts score eng kamida 1 bo'lishi mumkin.");

            ctx.scene.state.ielts = score;

            ctx.reply("Telefon raqamini yuboring. (example: 931234567)", Markup.keyboard([ctx.scene.state.teacher.phone.slice(4)]).resize());
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos ielts scoreni faqat sonlarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.scene.state.phone = "+998" + ctx.message.text.split(" ").join("");

            ctx.reply("Ustoz rasmini yuboring.", Markup.keyboard(["⬅️ Tashlab ketish"]).resize());
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos telefon raqamni faqat sonlarda kiriting.");
        };
    },
    async (ctx) => {
        if (ctx.message?.photo && ctx.message.photo.length > 0) {
            ctx.scene.state.image = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        };

        // save the new product on the database!
        try {
            const updatedTeacher = await User.findByIdAndUpdate(ctx.scene.state.teacher._id, ctx.scene.state, { new: true }).select("full_name ielts active branch phone image").lean();

            updatedTeacher.ratings = ctx.scene.state.teacher.ratings;

            ctx.reply("✅ Ustoz tahrirlandi.");
            ctx.scene.enter("admin:teacherSingle", updatedTeacher);
        } catch (error) {
            ctx.reply(error.message);
        };
    }
];

const scene = new WizardScene('admin:teacherEdit', ...steps);

module.exports = scene;
