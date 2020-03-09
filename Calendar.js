const incrDate = (d, i) => {
    d.setDate(d.getDate() + i);
    return d;
}

// method to find a day that's designated by its position in the month
const getDateByPosition = ({
    year,
    month,
    startDay = 1, // day to begin searching on in `month`
    matchDay = 1, // day of week (Sunday = 0, Sat = 6, that we're searching for)
    count = 1, // position in month (first occurance of day, 4th occurence, etc.)
    incr = 1, // whether to increment search up or down.
}) => {
    let d = new Date(year, month, startDay);
    let c = (d.getDay() === matchDay) ? 1 : 0;
    while (c < count) {
        incrDate(d, incr);
        if (d.getDay() === matchDay) {
            c += 1;
        }
    }
    return d;
};

const getMemorialDay = year => getDateByPosition({
    year,
    month: 4,
    startDay: 31,
    incr: -1,
});

const getLaborDay = year => getDateByPosition({
    year,
    month: 8,
});

const getColumbusDay = year => getDateByPosition({
    year,
    month: 9,
    count: 2,
});

const getElectionDay = year => getDateByPosition({
    year,
    month: 10,
    matchDay: 2,
});

const getThanksgiving = year => getDateByPosition({
    year,
    month: 10,
    matchDay: 4,
    count: 4,
});

const getNewYearsDay = year => new Date(year, 0, 1);
const getJulyFourth = year => new Date(year, 6, 4);
const getChristmasEve = year => new Date(year, 11, 24);
const getChristmasDay = year => new Date(year, 11, 25);
const getNewYearsEve = year => new Date(year, 11, 31);
