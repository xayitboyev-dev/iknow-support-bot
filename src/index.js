// configuration of dotenv
require("dotenv").config({ path: __dirname + "/config/.env" });

// require modules
const { session } = require("telegraf");
const checkUser = require("./middlewares/checkUser");
const onStart = require("./handlers/onStart");
const stage = require("./scenes/index");
const bot = require("./core/bot");

// use middlewares
bot.use(session());
bot.use(stage.start(onStart).middleware());
bot.use(checkUser);

// handle main scene
require("./scenes/main");

if (process.env.NODE_ENV === 'production') {
    require("./webhook");
} else {
    bot.launch();
    console.log("Bot started...");
};