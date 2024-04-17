module.exports = (ratings) => {
    let totalRating = 0;
    let totalVotes = 0;

    // Iterate through each star level and calculate the weighted sum
    for (let i = 1; i <= 5; i++) {
        totalRating += i * (ratings[i] || 0);
        totalVotes += ratings[i] || 0;
    };

    // Calculate the overall rating
    return (totalVotes === 0 ? 0 : totalRating / totalVotes).toFixed(1);
};