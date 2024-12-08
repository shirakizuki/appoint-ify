export const dateFormatter = (date) => {
    const newDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = newDate.toLocaleDateString('en-PH', options);
    return formattedDate;
}