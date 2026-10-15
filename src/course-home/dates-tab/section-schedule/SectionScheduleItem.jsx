import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

// Session dates and times are wall-clock values in the course timezone, so
// they are formatted as UTC to stop the browser from shifting them.
const formatDay = (intl, isoDate, { withYear = false } = {}) => intl.formatDate(new Date(`${isoDate}T00:00:00Z`), {
  day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC',
});
const formatClock = (intl, time) => intl.formatTime(new Date(`1970-01-01T${time}:00Z`), {
  hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
});

/**
 * One scheduled section on the Dates tab: its title, time in the course
 * timezone, instructor, tools and notes, and when its content opens if that
 * is after the session.
 */
const SectionScheduleItem = ({ item }) => {
  const intl = useIntl();
  const { session } = item;

  let times = null;
  if (session.startTime) {
    times = session.endTime
      ? `${formatClock(intl, session.startTime)}–${formatClock(intl, session.endTime)}`
      : formatClock(intl, session.startTime);
    if (session.timezoneAbbr) {
      times = `${times} ${session.timezoneAbbr}`;
    }
  }
  // The end date carries the year; the start date does too when it is in another year.
  const startsInOtherYear = session.startDate.slice(0, 4) !== session.endDate.slice(0, 4);
  const days = session.numDays > 1
    ? intl.formatMessage(messages.multipleDays, {
      startDate: formatDay(intl, session.startDate, { withYear: startsInOtherYear }),
      endDate: formatDay(intl, session.endDate, { withYear: true }),
    })
    : null;

  return (
    <div className="dates-section-schedule small pb-1" data-testid="dates-section-schedule">
      <div className="dates-section-schedule__title">{session.title}</div>
      {(times || days) && (
        <div className="dates-section-schedule__when">
          {[times, days].filter(Boolean).join(' · ')}
        </div>
      )}
      {session.instructor && (
        <div className="dates-section-schedule__detail">
          {intl.formatMessage(messages.instructor, { instructor: session.instructor })}
        </div>
      )}
      {session.toolsRequired && (
        <div className="dates-section-schedule__detail">
          {intl.formatMessage(messages.toolsRequired, { tools: session.toolsRequired })}
        </div>
      )}
      {session.notes && <div className="dates-section-schedule__notes">{session.notes}</div>}
      {session.contentAvailableFrom && (
        <div className="dates-section-schedule__notice">
          {intl.formatMessage(messages.contentAvailableFrom, {
            date: formatDay(intl, session.contentAvailableFrom, { withYear: true }),
          })}
        </div>
      )}
    </div>
  );
};

SectionScheduleItem.propTypes = {
  item: PropTypes.shape({
    session: PropTypes.shape({
      title: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      numDays: PropTypes.number.isRequired,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      timezoneAbbr: PropTypes.string,
      instructor: PropTypes.string,
      toolsRequired: PropTypes.string,
      notes: PropTypes.string,
      contentAvailableFrom: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default SectionScheduleItem;
