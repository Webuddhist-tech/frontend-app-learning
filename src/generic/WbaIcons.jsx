// Outline icons from the WBA learning designs (Course Learning, Course Unit).
// Each is shaped like a Paragon icon, so it works anywhere a Paragon icon
// does: <Icon src={...} />, <IconButton iconAs={...} />, iconBefore/iconAfter.
// They stroke with currentColor, so the brand sets their color, and are
// decorative unless a caller says otherwise (Paragon's Icon passes its own).

const makeIcon = (paths, { strokeWidth = 1.8, filled = false } = {}) => {
  const WbaIcon = (props) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths}
    </svg>
  );
  return WbaIcon;
};

const bookmarkPath = <path d="M6 3.5h12v17l-6-4.3-6 4.3z" />;

// Course home: course tools and the start card.
export const Bookmark = makeIcon(bookmarkPath);
export const BookmarkFilled = makeIcon(bookmarkPath, { filled: true });
export const Updates = makeIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 9h4v4H7zM14 9h3M14 13h3M7 16.5h10" />
  </>,
);
export const Compass = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <polygon points="16.2 7.8 13.6 13.6 7.8 16.2 10.4 10.4 16.2 7.8" />
  </>,
);
export const Chat = makeIcon(
  <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.3 9.3 0 0 1-3.4-.7L3 21l1.8-5.1A8.2 8.2 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />,
);

// Unit page: top-row buttons.
export const Bell = makeIcon(
  <>
    <path d="M12 3.2a5.4 5.4 0 0 0-5.4 5.4c0 4.2-1.4 5.6-2.1 6.3a.6.6 0 0 0 .4 1h14.2a.6.6 0 0 0 .4-1c-.7-.7-2.1-2.1-2.1-6.3A5.4 5.4 0 0 0 12 3.2z" />
    <path d="M10.2 19.2a2 2 0 0 0 3.6 0" />
  </>,
);
export const ArrowBack = makeIcon(
  <>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="11 6 5 12 11 18" />
  </>,
  { strokeWidth: 1.9 },
);
export const ArrowForward = makeIcon(
  <>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </>,
  { strokeWidth: 1.9 },
);

// Chevrons: bottom Previous/Next, the tray's back button and accordions.
export const ChevronLeft = makeIcon(<polyline points="15 6 9 12 15 18" />, { strokeWidth: 2 });
export const ChevronRight = makeIcon(<polyline points="9 6 15 12 9 18" />, { strokeWidth: 2 });
export const ChevronDown = makeIcon(<polyline points="6 9 12 15 18 9" />, { strokeWidth: 2 });
export const ChevronUp = makeIcon(<polyline points="6 15 12 9 18 15" />, { strokeWidth: 2 });

// Course outline tray: close it (lines, chevron pointing left) and reopen it.
export const OutlineClose = makeIcon(
  <>
    <line x1="3" y1="6" x2="15" y2="6" />
    <line x1="3" y1="12" x2="12" y2="12" />
    <line x1="3" y1="18" x2="15" y2="18" />
    <polyline points="22 7 17.5 12 22 17" />
  </>,
  { strokeWidth: 2 },
);
export const OutlineOpen = makeIcon(
  <>
    <polyline points="2 7 6.5 12 2 17" />
    <line x1="9" y1="6" x2="21" y2="6" />
    <line x1="12" y1="12" x2="21" y2="12" />
    <line x1="9" y1="18" x2="21" y2="18" />
  </>,
  { strokeWidth: 2 },
);

// Unit types in the outline tray.
export const Video = makeIcon(
  <>
    <rect x="3" y="6" width="12" height="12" rx="2.5" />
    <polygon points="16 10.5 21 7.5 21 16.5 16 13.5" />
  </>,
);
export const Reading = makeIcon(
  <>
    <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
    <polyline points="14 3 14 8 19 8" />
    <line x1="8.5" y1="12.5" x2="15.5" y2="12.5" />
    <line x1="8.5" y1="16" x2="13.5" y2="16" />
  </>,
);
export const Practice = makeIcon(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </>,
);

// Completion: an empty ring until done, a ticked circle once complete.
export const Ring = makeIcon(<circle cx="12" cy="12" r="9" />);
export const CheckCircle = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8.2 12.2 11 15 16 9.5" />
  </>,
);
// Done in the course outline: a solid circle with a white tick.
export const CheckCircleFilled = makeIcon(
  <>
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
    <polyline points="7.8 12.3 10.8 15.2 16.3 9.3" stroke="#FFFFFF" strokeWidth={2.4} />
  </>,
);

// Progress page: the grade notice (from the Course Progress design), info
// buttons and locked grades.
export const Warning = makeIcon(
  <>
    <path d="M12 3.6 1.8 20.4h20.4L12 3.6z" />
    <line x1="12" y1="10" x2="12" y2="14.5" />
    <line x1="12" y1="17.4" x2="12" y2="17.5" />
  </>,
  { strokeWidth: 1.9 },
);
export const Info = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16.5" />
    <line x1="12" y1="7.6" x2="12" y2="7.7" />
  </>,
);
export const Lock = makeIcon(
  <>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </>,
);
