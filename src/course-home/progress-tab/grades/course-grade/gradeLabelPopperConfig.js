// Popper config shared by the grade bar's two always-open labels (current
// grade above the bar, passing grade below it).
//
// - flip is off: each label keeps its side of the bar even when Popper
//   thinks there is no room.
// - followLayout re-places the labels when the page resizes. Popper only
//   updates on scroll and window resize, but content above the bar that
//   settles after mount (web fonts, cards loading in) moves the bar and
//   would leave the labels behind.
const followLayout = {
  name: 'followLayout',
  enabled: true,
  phase: 'main',
  fn: () => {},
  effect: ({ instance }) => {
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(() => instance.update());
    observer.observe(document.body);
    return () => observer.disconnect();
  },
};

const gradeLabelPopperConfig = {
  modifiers: [{ name: 'flip', enabled: false }, followLayout],
};

export default gradeLabelPopperConfig;
