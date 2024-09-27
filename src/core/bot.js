const { Telegraf } = require("telegraf");

// bot constructor
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setMyCommands([{ command: "/restart", description: "Botni yangilash" }, { command: "/book", description: "Ustoz qabuliga yozilish" }]);

module.exports = bot;
