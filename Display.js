const makeDay = (num, fam, txt = "",) => {
    const day = document.createElement("div");
    const numSpan = document.createElement("span");
    const colorMap = { "Friedman": "#1d13ad", "Treisman-Asiel": "#341818" };

    if (fam !== "") {
        numSpan.innerText = num;
    }
    day.appendChild(numSpan);
    day.style.backgroundColor = colorMap[fam] || "white";

    if (txt !== "") {
        const textSpan = document.createElement("span");
        textSpan.innerText = txt;
        day.appendChild(textSpan);
    }

    return day;
};
const getMonthName = d => d.toLocaleDateString("default", { month: "long" });
const currentDisplay = new Date();
const yearDisplay = document.getElementById("year-name");
const monthDisplay = document.getElementById("mo-name");

const setMonthDisplay = () => {
    const currentMonth = getMonthName(currentDisplay);
    monthDisplay.innerText = currentMonth;
}

const setYearDisplay = () => {
    const currentYear = currentDisplay.getFullYear();
    yearDisplay.innerText = currentYear;
}
const adjustMonth = (n) => {
    currentDisplay.setMonth(currentDisplay.getMonth() + n);
}

const decrementMonth = () => {
    adjustMonth(-1);
    setMonthDisplay();
    const prevYear = yearDisplay.innerText;
    if (currentDisplay.getFullYear() !== prevYear) {
        setYearDisplay();
    }
    buildCal();
}

const incrementMonth = () => {
    adjustMonth(1);
    setMonthDisplay();
    const prevYear = yearDisplay.innerText;
    if (currentDisplay.getFullYear() !== prevYear) {
        setYearDisplay();
    }
    buildCal();
}

// display the current month & year

setMonthDisplay();
setYearDisplay();

const getMonth = (mo, yr) => {
    return algorithms
        .filter(y => y[0].start.getFullYear() === yr)[0]
        .filter(wk => getMonthName(wk.start) === mo || getMonthName(wk.end) === mo);
};

// build the calendar

const generateAnnualHolidays = thisYear => ([
        getNewYearsDay(thisYear).toDateString(),
        getMemorialDay(thisYear).toDateString(),
        getJulyFourth(thisYear).toDateString(),
        getLaborDay(thisYear).toDateString(),
        getColumbusDay(thisYear).toDateString(),
        getElectionDay(thisYear).toDateString(),
        getThanksgiving(thisYear).toDateString(),
        getChristmasEve(thisYear).toDateString(),
        getChristmasDay(thisYear).toDateString(),
        getNewYearsEve(thisYear).toDateString(),
]);

const generateWeekdays = () => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names.map((n) => {
        const d = document.createElement("div");
        d.innerText = n;
        return d;
    });
}

const removeCalendar = () => {
    const divs = [...document.querySelectorAll("#calendar > div")];
    for (let d of divs) {
        d.parentElement.removeChild(d);
    }
};

const getFamilyForDay = (mo, day) => {
    try {
        return mo.filter(w => (day >= w.start && day <= w.end))[0].family;
    } catch (e) {
        return "";
    }

};

const buildCal = () => {
    const calendarDiv = document.querySelector("#calendar");
    const thisYear = parseInt(yearDisplay.innerText, 10);
    // const holidays = generateAnnualHolidays(thisYear);
    const mo = getMonth(monthDisplay.innerText, thisYear);
    const calMonth = [...generateWeekdays()];
    removeCalendar();

    const thisMonth = mo[1].start.getMonth();
    const firstDayOfThisMonth = new Date(thisYear, thisMonth, 1);

    let iter = new Date(firstDayOfThisMonth);

    while (iter.getDay() !== 0) {
        incrDate(iter, -1);
    }

    const lastDayOfMonth = new Date(thisYear, thisMonth + 1, 1);
    incrDate(lastDayOfMonth, -1);

    while (lastDayOfMonth.getDay() !== 6) {
        incrDate(lastDayOfMonth, 1);
    }
    while (iter <= lastDayOfMonth) {
        const day = new Date(iter);
        const family = getFamilyForDay(mo, day);
        const dayDiv = makeDay(day.getDate(), family);
        calMonth.push(dayDiv);
        incrDate(iter, 1);
    }

    for (let dayDiv of calMonth) {
        calendarDiv.appendChild(dayDiv);
    }
};

// set event listeners

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prev").addEventListener("click", decrementMonth);
    document.getElementById("next").addEventListener("click", incrementMonth);
});

buildCal();
