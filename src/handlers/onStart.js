const { main } = require("../keyboards/button");

module.exports = (ctx) => {
    ctx.scene.leave();
    ctx.reply("Hello World!", main);
};