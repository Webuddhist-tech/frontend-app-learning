export const SECTION_SCHEDULE_DATE_TYPE = 'section-schedule';

export const isSectionSchedule = (item) => item.dateType === SECTION_SCHEDULE_DATE_TYPE;

/** The calendar date ("2026-10-12") of an instant in a timezone. */
const dateFormatters = {};
const dateInZone = (instant, timeZone) => {
  dateFormatters[timeZone] = dateFormatters[timeZone]
    || new Intl.DateTimeFormat('en-CA', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    });
  return dateFormatters[timeZone].format(instant);
};

/**
 * A session's place on the timeline, as a Date in the browser's timezone.
 *
 * Sessions are wall-clock values in the course timezone ("2026-10-12",
 * "19:00") and are shown exactly so, without conversion. The timeline groups
 * items by the browser's calendar day but prints each day's header in the
 * learner's account timezone, so the session needs an instant that falls on
 * its date in both. Local noon is tried first, then the hours either side of
 * it, taking the first that is also on that date in the account timezone (the
 * two zones can differ by half a day or more). Start-time minutes are then
 * added as seconds so sessions on one day stay in time order.
 */
const toLocalDate = (isoDate, time, userTimezone) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const [hours, minutes] = (time || '00:00').split(':').map(Number);
  const secondsOfOrder = hours * 60 + minutes; // at most 24 minutes
  const at = (hour) => new Date(year, month - 1, day, hour, 0, secondsOfOrder);

  if (userTimezone) {
    // 12, 11, 13, 10, 14, ... : closest to noon first.
    for (let step = 0; step < 24; step += 1) {
      const hour = 12 + (step % 2 ? -(step + 1) / 2 : step / 2);
      if (hour >= 0 && hour <= 23) {
        const candidate = at(hour);
        const later = at(hour); // the same hour, 59 minutes on, must still be on the date
        later.setMinutes(59);
        if (dateInZone(candidate, userTimezone) === isoDate && dateInZone(later, userTimezone) === isoDate) {
          return candidate;
        }
      }
    }
  }
  return at(12);
};

/** Timeline items for the sessions, shaped like the Dates API's date blocks. */
export const toDateBlocks = (sessions, userTimezone) => sessions.map((session) => ({
  date: toLocalDate(session.startDate, session.startTime, userTimezone).toISOString(),
  dateType: SECTION_SCHEDULE_DATE_TYPE,
  title: session.title,
  // Sessions are open to every learner who can see them; this keeps them
  // out of the "Verified only" and assignment badges.
  learnerHasAccess: true,
  session,
}));

/** The Dates API's blocks and the sessions in one list, sorted by date as the timeline expects. */
export const mergeDateBlocks = (courseDateBlocks, sessions, userTimezone) => {
  if (!sessions.length) {
    return courseDateBlocks;
  }
  return [...courseDateBlocks, ...toDateBlocks(sessions, userTimezone)]
    .map((block, index) => ({ block, index, time: new Date(block.date).getTime() }))
    .sort((a, b) => a.time - b.time || a.index - b.index)
    .map(({ block }) => block);
};
