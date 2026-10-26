import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';

import LmsHtmlFragment from '../LmsHtmlFragment';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';
import '../SidebarCards.scss';

// Studio saves cleared handouts as bare markup (usually "<ol></ol>"), so an
// empty string check alone still renders an empty card.
const hasHandoutsContent = (html) => {
  if (!html) {
    return false;
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent.trim() !== ''
    || !!doc.body.querySelector('img, video, audio, iframe, object, embed');
};

const CourseHandouts = () => {
  const intl = useIntl();
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const {
    handoutsHtml,
  } = useModel('outline', courseId);
  const hasContent = useMemo(() => hasHandoutsContent(handoutsHtml), [handoutsHtml]);

  if (!hasContent) {
    return null;
  }

  return (
    <section className="mb-4 course-sidebar-card">
      <h2 className="h4">{intl.formatMessage(messages.handouts)}</h2>
      <LmsHtmlFragment
        className="small"
        html={handoutsHtml}
        title={intl.formatMessage(messages.handouts)}
      />
    </section>
  );
};

export default CourseHandouts;
