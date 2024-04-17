const { holidays, nextDays } = require("../config/config.json");

module.exports = (previousDay = 0) => {
    const dates = [];

    for (let i = 1; i <= nextDays; i++) {
        const date = new Date();

        dates.push(new Date(date.setDate(date.getDate() + i - previousDay)));
    };

    return dates.map((item) => ({ date: item.toLocaleDateString("en-GB", { timeZone: "Asia/Tashkent", day: '2-digit', month: '2-digit', year: 'numeric', }), holiday: holidays.includes(item.getDay()) }))
};