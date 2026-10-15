import { mergeDateBlocks, toDateBlocks } from './utils';

const session = (overrides) => ({
  sectionId: 's1',
  title: 'Lesson 1',
  startDate: '2026-10-12',
  endDate: '2026-10-12',
  numDays: 1,
  startTime: '19:00',
  endTime: '20:30',
  ...overrides,
});

// The day a block lands on, in the browser's timezone (how the timeline groups)
// and in the account timezone (how the day header is printed).
const dayIn = (block, timeZone) => new Intl.DateTimeFormat('en-CA', {
  timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(block.date));
const browserDay = (block) => {
  const date = new Date(block.date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

describe('toDateBlocks', () => {
  it.each([
    'Asia/Kolkata',
    'America/Los_Angeles',
    'Pacific/Kiritimati',
    'Pacific/Pago_Pago',
    'UTC',
  ])('puts a session on its own date in the browser and in the account timezone (%s)', (userTimezone) => {
    const [block] = toDateBlocks([session()], userTimezone);
    expect(browserDay(block)).toBe('2026-10-12');
    expect(dayIn(block, userTimezone)).toBe('2026-10-12');
  });

  it('falls back to local noon without an account timezone', () => {
    const [block] = toDateBlocks([session({ startTime: null })]);
    expect(browserDay(block)).toBe('2026-10-12');
    expect(new Date(block.date).getHours()).toBe(12);
  });

  it('keeps sessions of one day in time order', () => {
    const [early, late] = toDateBlocks([
      session({ sectionId: 'a', startTime: '09:00' }),
      session({ sectionId: 'b', startTime: '19:00' }),
    ], 'UTC');
    expect(new Date(early.date) < new Date(late.date)).toBe(true);
  });

  it('keeps the session and marks it as open to every learner', () => {
    const [block] = toDateBlocks([session()], 'UTC');
    expect(block).toMatchObject({ dateType: 'section-schedule', learnerHasAccess: true, title: 'Lesson 1' });
    expect(block.session.sectionId).toBe('s1');
  });
});

describe('mergeDateBlocks', () => {
  const api = [
    { title: 'Course starts', date: '2026-10-01T00:00:00Z', dateType: 'course-start-date' },
    { title: 'Quiz', date: '2026-10-12T23:59:00Z', dateType: 'assignment-due-date' },
    { title: 'Course ends', date: '2026-12-31T00:00:00Z', dateType: 'course-end-date' },
  ];

  it('returns the API blocks untouched when there are no sessions', () => {
    expect(mergeDateBlocks(api, [], 'UTC')).toBe(api);
  });

  it('sorts sessions in among the API blocks by date', () => {
    const merged = mergeDateBlocks(api, [session({ startDate: '2026-11-02', endDate: '2026-11-02' }), session({ sectionId: 's0' })], 'UTC');
    expect(merged.map((block) => block.title)).toEqual(['Course starts', 'Lesson 1', 'Quiz', 'Lesson 1', 'Course ends']);
    expect(merged.map((block) => block.dateType)).toEqual([
      'course-start-date', 'section-schedule', 'assignment-due-date', 'section-schedule', 'course-end-date',
    ]);
  });
});
