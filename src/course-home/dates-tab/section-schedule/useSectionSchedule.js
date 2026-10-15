import { useEffect, useState } from 'react';

import { getSectionSchedule } from './api';

// The last sessions loaded for each course, so coming back to the Dates tab
// shows them straight away (and refreshes them) instead of popping in late.
const lastLoaded = new Map();

/**
 * The sessions to show on the Dates tab, or [] until they load or if there are none.
 *
 * Fetched here rather than in the Dates tab thunk on purpose, so a problem
 * with the schedule can never break the rest of the tab.
 */
const useSectionSchedule = (courseId) => {
  const [sessions, setSessions] = useState(() => lastLoaded.get(courseId) || []);

  useEffect(() => {
    let isCurrent = true;
    setSessions(lastLoaded.get(courseId) || []);
    if (courseId) {
      getSectionSchedule(courseId).then((data) => {
        const loaded = data.enabled ? data.sessions || [] : [];
        lastLoaded.set(courseId, loaded);
        if (isCurrent) {
          setSessions(loaded);
        }
      });
    }
    return () => { isCurrent = false; };
  }, [courseId]);

  return sessions;
};

export default useSectionSchedule;
