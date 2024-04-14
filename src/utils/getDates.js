module.exports = () => {
    const dates = [];

    for (let i = 1; i <= 3; i++) {
        const date = new Date();

        dates.push(new Date(date.setDate(date.getDate() + i)));
    };

    return dates.map((item) => item.toLocaleDateString("en-GB", { timeZone: "Asia/Tashkent", day: '2-digit', month: '2-digit', year: 'numeric' }))
};