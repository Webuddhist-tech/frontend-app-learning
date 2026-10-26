import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { ExpandLess, ExpandMore } from '@openedx/paragon/icons';
import classNames from 'classnames';

import { useModel } from '../../../generic/model-store';

import Day from './Day';
import { isPastDue } from './badgelist';
import messages from '../messages';
import { daycmp, isLearnerAssignment } from '../utils';
import { mergeDateBlocks, useSectionSchedule } from '../section-schedule';

const Timeline = () => {
  const intl = useIntl();
  const [showEarlierDates, setShowEarlierDates] = useState(false);
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    courseDateBlocks: apiDateBlocks,
  } = useModel('dates', courseId);
  const { userTimezone } = useModel('courseHomeMeta', courseId);
  const sessions = useSectionSchedule(courseId);
  const courseDateBlocks = useMemo(
    () => mergeDateBlocks(apiDateBlocks, sessions, userTimezone),
    [apiDateBlocks, sessions, userTimezone],
  );

  // Group date items by day (assuming they are sorted in first place) and add some metadata
  const groupedDates = [];
  const now = new Date();
  let foundNextDue = false;
  let foundToday = false;
  courseDateBlocks.forEach(courseDateBlock => {
    const dateInfo = { ...courseDateBlock };
    const parsedDate = new Date(dateInfo.date);

    if (!foundNextDue && parsedDate >= now && isLearnerAssignment(dateInfo) && !dateInfo.complete) {
      foundNextDue = true;
      dateInfo.dueNext = true;
    }

    if (!foundToday) {
      const compared = daycmp(parsedDate, now);
      if (compared === 0) {
        foundToday = true;
      } else if (compared > 0) {
        foundToday = true;
        groupedDates.push({
          date: now,
          items: [],
        });
      }
    }

    if (groupedDates.length === 0 || daycmp(groupedDates[groupedDates.length - 1].date, parsedDate) !== 0) {
      // Add new grouped date
      groupedDates.push({
        date: parsedDate,
        items: [dateInfo],
        first: groupedDates.length === 0,
      });
    } else {
      groupedDates[groupedDates.length - 1].items.push(dateInfo);
    }
  });
  if (!foundToday) {
    groupedDates.push({ date: now, items: [] });
  }
  if (groupedDates.length) {
    groupedDates[groupedDates.length - 1].last = true;
  }

  // Long schedules start at today: the days before it (always at the front,
  // since the list is sorted and today is always in it) stay folded away
  // until the learner asks for them. Folding stops at the first day with
  // past-due work the learner can still do, so it stays in view, and nothing
  // folds when no date is ahead (an ended course would look empty).
  const daysBeforeToday = groupedDates.findIndex(({ date }) => daycmp(date, now) >= 0);
  const hasUpcoming = groupedDates.slice(daysBeforeToday).some(({ items }) => items.length > 0);
  const firstPastDueDay = groupedDates.slice(0, daysBeforeToday).findIndex(({ items }) => items.some(
    (item) => isLearnerAssignment(item) && isPastDue(item),
  ));
  let earlierCount = 0;
  if (hasUpcoming) {
    earlierCount = firstPastDueDay === -1 ? daysBeforeToday : firstPastDueDay;
  }
  const shownDates = showEarlierDates ? groupedDates : groupedDates.slice(earlierCount);
  if (shownDates.length) {
    shownDates[0] = { ...shownDates[0], first: true };
  }

  return (
    <ul className="list-unstyled m-0 mt-4 pt-2 dates-timeline">
      {earlierCount > 0 && (
        <li className={classNames('dates-timeline-earlier', { 'is-open': showEarlierDates })}>
          <Button
            variant="link"
            iconAfter={showEarlierDates ? ExpandLess : ExpandMore}
            aria-expanded={showEarlierDates}
            onClick={() => setShowEarlierDates(!showEarlierDates)}
          >
            {showEarlierDates
              ? intl.formatMessage(messages.hideEarlierDates)
              : intl.formatMessage(messages.showEarlierDates, { count: earlierCount })}
          </Button>
        </li>
      )}
      {shownDates.map((groupedDate) => (
        <Day key={groupedDate.date} {...groupedDate} />
      ))}
    </ul>
  );
};

export default Timeline;
