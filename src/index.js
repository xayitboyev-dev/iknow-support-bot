// configuration of dotenv
require("dotenv").config({ path: __dirname + "/config/.env" });

// connect to database
require("./utils/database")();

// require modules
const { session } = require("telegraf");
const auth = require("./middlewares/auth");
const userAuth = require("./middlewares/userAuth");
const teacherAuth = require("./middlewares/teacherAuth");
const onRequestAction = require("./handlers/onRequestAction");
const onTeacherRequestAction = require("./handlers/onTeacherRequestAction");
const onDeleteLessonAction = require("./handlers/onDeleteLessonAction");
const onLessonAction = require("./handlers/onLessonAction");
const checkUser = require("./middlewares/checkUser");
const onBlocked = require("./handlers/onBlocked");
const onRate = require("./handlers/onRate");
const stage = require("./scenes/index");
const bot = require("./core/bot");

// on request action
bot.action(/^request_confirm_(.+)|request_cancel_(.+)$/, onRequestAction);

// check is the bot update from a user 
bot.use(checkUser);

// on rate teacher action
bot.action(/^rate_(.+)_(.+)$/, onRate);

// teacher request action for teacher
bot.action(/^accept_lesson_(.+)|deny_lesson_(.+)$/, auth, teacherAuth, onTeacherRequestAction);

// lesson finish or reject action for teacher
bot.action(/^finish_lesson_(.+)|reject_lesson_(.+)$/, auth, teacherAuth, onLessonAction);

// delete lesson action for user
bot.action(/^delete_lesson_(.+)$/, auth, userAuth, onDeleteLessonAction);

// use middlewares
bot.use(session());
bot.use(stage
    .on("my_chat_member", onBlocked)
    .hears("🔙 Bekor qilish", (ctx) => ctx.scene.enter("admin:main"))
    .hears(["◀️ Bekor qilish", "⏪ Orqaga"], (ctx) => ctx.scene.enter("main"))
    .command("admin", (ctx) => ctx.scene.enter("admin:main"))
    .command("teacher", (ctx) => ctx.scene.enter("teacher:register"))
    .middleware()
);

// run bot
if (process.env.NODE_ENV === 'production') {
    require("./webhook");
} else {
    bot.launch();
    console.log("Bot started...");
};

// handle unhandled rejections
process.on("unhandledRejection", (reason) => console.log("unhandledRejection:", reason));
process.on("uncaughtException", (reason) => console.log("uncaughtException:", reason));