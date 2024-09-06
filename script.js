const holidays = [
    { date: '2024-02-27', halfDay: false, name: 'Municipal Elections Day' },
    { date: '2024-04-22', halfDay: true, name: 'Passover Eve' },
    { date: '2024-04-23', halfDay: false, name: 'Passover' },
    { date: '2024-04-28', halfDay: true, name: 'Passover II Eve' },
    { date: '2024-04-29', halfDay: false, name: 'Passover II' },
    { date: '2024-05-13', halfDay: true, name: 'Independence Day Eve' },
    { date: '2024-05-14', halfDay: false, name: 'Independence Day' },
    { date: '2024-06-11', halfDay: true, name: 'Shavuot Eve' },
    { date: '2024-06-12', halfDay: false, name: 'Shavuot' },
    { date: '2024-10-02', halfDay: true, name: 'Rosh Hashanah Eve' },
    { date: '2024-10-03', halfDay: false, name: 'Rosh Hashanah' },
    { date: '2024-10-04', halfDay: false, name: 'Rosh Hashanah II' },
    { date: '2024-10-11', halfDay: true, name: 'Yom Kippur Eve' },
    { date: '2024-10-12', halfDay: false, name: 'Yom Kippur' },
    { date: '2024-10-16', halfDay: true, name: 'Sukkot Eve' },
    { date: '2024-10-17', halfDay: false, name: 'Sukkot' },
    { date: '2024-10-23', halfDay: true, name: 'Simchat Torah Eve' },
    { date: '2024-10-24', halfDay: false, name: 'Simchat Torah' }
];

function uncheckOther(selected) {
    if (selected === 'fridays') {
        document.getElementById('work-sundays').checked = false;
    } else if (selected === 'sundays') {
        document.getElementById('work-fridays').checked = false;
    }
}

function calculateVacationDays() {
    const startDateValue = document.getElementById('start-date').value;
    const endDateValue = document.getElementById('end-date').value;
    const workFridays = document.getElementById('work-fridays').checked;
    const workSundays = document.getElementById('work-sundays').checked;

    if (!startDateValue || !endDateValue) {
        document.getElementById('result').innerText = "Please select both start and end dates.";
        return;
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    if (startDate > endDate) {
        document.getElementById('result').innerText = "Start date must be before end date.";
        return;
    }

    let totalVacationDays = 0;
    let holidayDetails = "";
    let totalWeekendDays = 0;

    // Loop through each day between startDate and endDate
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const formattedDate = d.toISOString().split('T')[0];
        const dayOfWeek = d.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
        
        // Check if it's a weekend
        if (dayOfWeek === 6) {
            totalWeekendDays++; // Always count Saturday as a weekend day
            continue; // Skip Saturday
        } else if (workFridays && dayOfWeek === 0) {
            totalWeekendDays++; // If working Fridays, Sunday is a weekend
            continue; // Skip Sunday
        } else if (workSundays && dayOfWeek === 5) {
            totalWeekendDays++; // If working Sundays, Friday is a weekend
            continue; // Skip Friday
        }

        // Check if the current date is a holiday
        const holiday = holidays.find(h => h.date === formattedDate);

        if (holiday) {
            totalVacationDays += holiday.halfDay ? 0.5 : 1;
            holidayDetails += `<p>${holiday.name} (${holiday.halfDay ? 'Half Day' : 'Full Day'})</p>`;
        } else {
            totalVacationDays += 1;  // Regular workday
        }
    }

    // Display total vacation days and holiday details
    const totalVacationTime = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    document.getElementById('result').innerHTML = `
    
    <p>Total Vacation Days Needed: <span class="total-vacation-days">${totalVacationDays} days</span></p>
    <p>Total Vacation Time: <span class="total-vacation-time">${totalVacationTime} days</span></p>
    <p>Weekend Days: <span class="weekend-days">${totalWeekendDays} days</span> (Don't Require Vacation days)</p> 
`;
    document.getElementById('holiday-list').innerHTML = holidayDetails ? holidayDetails : "No holidays during the selected period.";
}
