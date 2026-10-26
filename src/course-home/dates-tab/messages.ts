import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  completed: {
    id: 'learning.dates.badge.completed',
    defaultMessage: 'Completed',
    description: 'shown as label for the assignments which learner has completed.',
  },
  dueNext: {
    id: 'learning.dates.badge.dueNext',
    defaultMessage: 'Due next',
    description: 'Shown as label for the assignment which date is in the future',
  },
  pastDue: {
    id: 'learning.dates.badge.pastDue',
    defaultMessage: 'Past due',
    description: 'Shown as label for the assignments which deadline has passed',
  },
  showEarlierDates: {
    id: 'learning.dates.showEarlierDates',
    defaultMessage: '{count, plural, one {Show # earlier date} other {Show # earlier dates}}',
    description: 'Button above the dates timeline that reveals the dates before today, which start hidden.',
  },
  hideEarlierDates: {
    id: 'learning.dates.hideEarlierDates',
    defaultMessage: 'Hide earlier dates',
    description: 'Button above the dates timeline that hides the dates before today again.',
  },
  title: {
    id: 'learning.dates.title',
    defaultMessage: 'Important dates',
    description: 'The title of dates tab (course timeline).',
  },
  today: {
    id: 'learning.dates.badge.today',
    defaultMessage: 'Today',
    description: 'Label used when the scheduled date for the assignment matches the current day',
  },
  unreleased: {
    id: 'learning.dates.badge.unreleased',
    defaultMessage: 'Not yet released',
    description: 'Shown as label for assignments which date is unknown yet',
  },
  verifiedOnly: {
    id: 'learning.dates.badge.verifiedOnly',
    defaultMessage: 'Verified only',
    description: 'Shown as label for assignments which learner has no access to.',
  },
});

export default messages;
