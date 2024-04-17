// configuration of dotenv
require("dotenv").config({ path: __dirname + "/config/.env" });

// connect to database
require("./utils/database")();

// require modules
const { session } = require("telegraf");
const onRequestAction = require("./handlers/onRequestAction");
const checkUser = require("./middlewares/checkUser");
const onBlocked = require("./handlers/onBlocked");
const onStart = require("./handlers/onStart");
const onRate = require("./handlers/onRate");
const stage = require("./scenes/index");
const bot = require("./core/bot");

// on request action
bot.action(/^request_confirm_(.+)|request_cancel_(.+)$/, onRequestAction);

// on rate teacher action
bot.action(/^rate_(.+)_(.+)$/, onRate);

// use middlewares
bot.use(session());
bot.use(stage.use(checkUser)
    .start(onStart)
    .on("my_chat_member", onBlocked)
    .hears("🔙 Bekor qilish", (ctx) => ctx.scene.enter("admin:main"))
    .hears("⏪ Orqaga", (ctx) => ctx.scene.enter("main"))
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