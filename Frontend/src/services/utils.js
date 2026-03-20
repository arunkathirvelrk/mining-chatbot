export const groupHistoryByDate = (items) => {
    const groups = { Today: [], Yesterday: [], Previous: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    items.forEach(item => {
        const dateString = item.created_at || item.updated_at;
        if (!dateString) {
            groups.Previous.push(item);
            return;
        }
        const date = new Date(dateString);
        if (date >= today) groups.Today.push(item);
        else if (date >= yesterday) groups.Yesterday.push(item);
        else groups.Previous.push(item);
    });
    return groups;
};
