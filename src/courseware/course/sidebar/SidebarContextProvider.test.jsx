import { useContext } from 'react';
import { breakpoints } from '@openedx/paragon';
import { render, screen } from '@testing-library/react';

import SidebarContext from './SidebarContext';
import SidebarProvider from './SidebarContextProvider';
import * as discussionsSidebar from './sidebars/discussions';

jest.mock('@src/generic/model-store', () => ({
  useModel: (type) => (type === 'discussionTopics'
    ? { id: 'topic-1', enabledInContext: true }
    : { verifiedMode: null }),
}));

const CurrentSidebar = () => {
  const { currentSidebar } = useContext(SidebarContext);
  return <div data-testid="current-sidebar">{currentSidebar || 'none'}</div>;
};

const renderProvider = () => render(
  <SidebarProvider courseId="course-v1:edX+DemoX+Demo_Course" unitId="unit-1">
    <CurrentSidebar />
  </SidebarProvider>,
);

describe('SidebarProvider', () => {
  beforeEach(() => {
    global.innerWidth = breakpoints.extraExtraLarge.minWidth;
    window.history.pushState({}, '', '/');
    localStorage.clear();
  });

  it('does not open the discussions sidebar on its own on wide screens', () => {
    renderProvider();
    expect(screen.getByTestId('current-sidebar')).toHaveTextContent('none');
  });

  it('opens the discussions sidebar when the link asks for it', () => {
    window.history.pushState({}, '', '/?sidebar=true');
    renderProvider();
    expect(screen.getByTestId('current-sidebar')).toHaveTextContent(discussionsSidebar.ID);
  });
});
