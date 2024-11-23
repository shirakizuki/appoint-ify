const calculateDateRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);

    const formatDate = (date) => {
        const options = { month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    const getDayName = (date) => {
        const options = { weekday: "short" };
        return date.toLocaleDateString("en-US", options);
    };

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return {
            fullDate: date.toISOString().split("T")[0],
            formattedDate: formatDate(date),
            dayName: getDayName(date),
        };
    });
};

export default calculateDateRange;