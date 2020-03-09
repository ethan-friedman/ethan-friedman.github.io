
// todo make year flexible
const y = new Date().getFullYear();
const years = [y - 1, y, y + 1];
const TreismanAsiel = "Treisman-Asiel";
const Friedman = "Friedman";
const toggleFamily = fam => fam === Friedman ? TreismanAsiel : Friedman;

const algorithms = years.map((year) => {
    const isEvenYear = year % 2 === 0;
    const memorialDay = getMemorialDay(year);
    const mondayBeforeMemorialDay = getDateByPosition({
        year,
        month: memorialDay.getMonth(),
        startDay: memorialDay.getDate() - 1,
        incr: -1
    });

    // this will be an array of objects describing the year

    const kildareAlgorithm = [
        {
            start: mondayBeforeMemorialDay,
            end: memorialDay,
            family: isEvenYear ? TreismanAsiel : Friedman,
        },
    ];

    let dateIter = new Date(memorialDay);

    const lastSundayInJune = getDateByPosition({
        year,
        month: 5,
        startDay: 30,
        incr: -1,
        matchDay: 0,
    });

    while (dateIter <= lastSundayInJune) {
        incrDate(dateIter, 1);
        if (dateIter.getDay() === 0) {
            const priorWeek = kildareAlgorithm[kildareAlgorithm.length - 1];
            let start = incrDate(new Date(priorWeek.end), 1);
            kildareAlgorithm.push({
                start,
                end: new Date(dateIter),
                family: toggleFamily(priorWeek.family),
            });
        }
    }

    const endOfJuly = new Date(year, 6, 31);

    const july = {
        start: incrDate(new Date(lastSundayInJune), 1),
        end: endOfJuly,
        family: isEvenYear ? Friedman : TreismanAsiel,
    };
    kildareAlgorithm.push(july);
    const laborDay = getLaborDay(year);

    const august = {
        start: new Date(year, 7, 1),
        end: laborDay,
        family: toggleFamily(july.family),
    };

    kildareAlgorithm.push(august);

    const firstSundayInOctober = getDateByPosition({
        year,
        month: 9,
        matchDay: 0,
    });

    dateIter = new Date(laborDay);

    // TODO same logic as above while loop -- abstract into fxn
    while (dateIter <= firstSundayInOctober) {
        incrDate(dateIter, 1);
        if (dateIter.getDay() === 0) {
            const priorWeek = kildareAlgorithm[kildareAlgorithm.length - 1];
            let start = incrDate(new Date(priorWeek.end), 1);
            kildareAlgorithm.push({
                start,
                end: new Date(dateIter),
                family: toggleFamily(priorWeek.family),
            });
        }
    }

    const columbusDay = getColumbusDay(year);
    const weekOfColumbusDay = {
        start: incrDate(new Date(firstSundayInOctober), 1),
        end: columbusDay,
        family: isEvenYear ? Friedman : TreismanAsiel,
    };

    kildareAlgorithm.push(weekOfColumbusDay);


    const sundayAfterColumbusDay = incrDate(new Date(columbusDay), 6);

    const weekAfterColumbusDay = {
        start: incrDate(new Date(columbusDay), 1),
        end: sundayAfterColumbusDay,
        family: toggleFamily(weekOfColumbusDay.family),
    };

    kildareAlgorithm.push(weekAfterColumbusDay);

    const electionDay = getElectionDay(year);
    const sundayBeforeElectionDay = new Date(electionDay);
    sundayBeforeElectionDay.setDate(electionDay.getDate() - 2);
    const sundayAfterElectionDay = getDateByPosition({
        year,
        month: 10,
        startDay: electionDay.getDate(),
        matchDay: 0,
    });

    dateIter = new Date(sundayAfterColumbusDay);

    while (dateIter <= electionDay) {
        incrDate(dateIter, 1);
        if (dateIter.getDay() === 0 && dateIter.toDateString() !== sundayBeforeElectionDay.toDateString()) {
            const priorWeek = kildareAlgorithm[kildareAlgorithm.length - 1];
            kildareAlgorithm.push({
                start: incrDate(new Date(priorWeek.end), 1),
                end: new Date(dateIter),
                family: toggleFamily(priorWeek.family),
            });
        } else if (dateIter.toDateString() === sundayBeforeElectionDay.toDateString()) {
            const priorWeek = kildareAlgorithm[kildareAlgorithm.length - 1];
            kildareAlgorithm.push({
                start: incrDate(new Date(priorWeek.end), 1),
                end: incrDate(new Date(electionDay), -1),
                family: isEvenYear ? TreismanAsiel : Friedman,
            });
        } else if (dateIter.toDateString() === electionDay.toDateString()) {
            kildareAlgorithm.push({
                start: new Date(electionDay),
                end: new Date(sundayAfterElectionDay),
                family: isEvenYear ? Friedman : TreismanAsiel,
            });
        }
    }

    const thanksgiving = getThanksgiving(year);
    const sundayBeforeThanksgiving = incrDate(new Date(thanksgiving), -4);
    const sundayAfterThanksgiving = incrDate(new Date(thanksgiving), 3);

    dateIter = new Date(sundayAfterElectionDay);

    while (dateIter <= sundayBeforeThanksgiving) {
        incrDate(dateIter, 1);
        if (dateIter.getDay() === 0) {
            const priorWeek = kildareAlgorithm[kildareAlgorithm.length - 1];
            let start = incrDate(new Date(priorWeek.end), 1);
            kildareAlgorithm.push({
                start,
                end: new Date(dateIter),
                family: toggleFamily(priorWeek.family),
            });
        }
    }

    const weekOfThanksgiving = {
        start: incrDate(new Date(sundayBeforeThanksgiving), 1),
        end: new Date(sundayAfterThanksgiving),
        family: isEvenYear ? TreismanAsiel : Friedman,
    };

    kildareAlgorithm.push(weekOfThanksgiving);

    const endOfYear = new Date(year, 11, 31);
    dateIter = new Date(sundayAfterThanksgiving);

    while (dateIter <= endOfYear) {
        incrDate(dateIter, 1);
        if (dateIter.getDay() === 0) {
            const priorWeek = kildareAlgorithm[kildareAlgorithm.length - 1];
            kildareAlgorithm.push({
                start: incrDate(new Date(priorWeek.end), 1),
                end: new Date(dateIter),
                family: toggleFamily(priorWeek.family),
            });
        }
    }

    // now we go backwards from week 1 to beginning of year
    // this is backwards but how the algorithm is written so whatever.

    const startOfYear = new Date(year, 0, 1);

    dateIter = new Date(kildareAlgorithm[0].start);

    while (dateIter >= startOfYear) {
        incrDate(dateIter, -1);
        if (dateIter.getDay() === 0) {
            const nextWeek = kildareAlgorithm[0];
            const startOfWeek = incrDate(new Date(dateIter), -6);

            kildareAlgorithm.unshift({
                start: startOfWeek.getFullYear() === year
                    ? startOfWeek : startOfYear,
                end: incrDate(new Date(nextWeek.start), -1),
                family: toggleFamily(nextWeek.family),
            });
        } else if (dateIter.toDateString() === startOfYear.toDateString() && kildareAlgorithm[0].start !== startOfYear) {
            const nextWeek = kildareAlgorithm[0];
            kildareAlgorithm.unshift({
                start: new Date(startOfYear),
                end: incrDate(new Date(nextWeek.start), -1),
                family: toggleFamily(nextWeek.family),
            });
        }
    }

    return kildareAlgorithm;
});
