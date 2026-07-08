const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i); // Subtract days (0 is today, 1 is yesterday, etc.)
    
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(d.getDate()).padStart(2, '0');
    
    return `${yyyy}${mm}${dd}`;
});

console.log(dates);

