import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  instructor: {
    id: 'learning.dates.sectionSchedule.instructor',
    defaultMessage: 'Instructor: {instructor}',
    description: 'Who teaches a scheduled section, on the Dates tab',
  },
  toolsRequired: {
    id: 'learning.dates.sectionSchedule.toolsRequired',
    defaultMessage: 'Tools required: {tools}',
    description: 'What learners need for a scheduled section, on the Dates tab',
  },
  contentAvailableFrom: {
    id: 'learning.dates.sectionSchedule.contentAvailableFrom',
    defaultMessage: 'Content available from {date}',
    description: 'Shown when a section is scheduled before its content is released to learners',
  },
  multipleDays: {
    id: 'learning.dates.sectionSchedule.multipleDays',
    defaultMessage: '{startDate} – {endDate}',
    description: 'Date range of a section scheduled over several days, e.g. "13 Oct – 14 Oct"',
  },
});

export default messages;
