import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { useContextId } from '../../../../data/hooks';
import { useModel } from '../../../../generic/model-store';

import messages from '../messages';

// Labels near either end of the bar align inward so they stay on the card.
const edgeClass = (value) => {
  if (value <= 8) {
    return 'is-at-start';
  }
  return value >= 92 ? 'is-at-end' : '';
};

// The current and passing grades as two figures over one bar. The bar fills
// to the current grade, a tick marks the passing grade, and the scale under
// it labels the tick and both ends. Plain markup rather than popovers, so it
// reflows on any width.
const GradeBar = ({ passingGrade }) => {
  const intl = useIntl();
  const courseId = useContextId();

  const {
    assignmentTypeGradeSummary,
    courseGrade: {
      isPassing,
      percent,
    },
  } = useModel('progress', courseId);

  const currentGrade = Number((percent * 100).toFixed(0));
  const hasHiddenGrades = assignmentTypeGradeSummary.some((assignmentType) => assignmentType.hasHiddenContribution !== 'none');
  const rtlMark = isRtl(getLocale()) ? '‏' : '';
  const shownGrade = Math.min(currentGrade, 100);
  // The 0% / 100% ends give way when the passing label would sit on them.
  const showStartLabel = passingGrade > 14;
  const showEndLabel = passingGrade < 86;

  return (
    <div className="col-12 col-sm-6 align-self-center p-0">
      <div className="sr-only">{intl.formatMessage(messages.courseGradeBarAltText, { currentGrade, passingGrade })}</div>
      <div className={classNames('grade-bar', isPassing ? 'is-passing' : 'is-not-passing')} aria-hidden="true">
        <div className="grade-bar__stats">
          <div className="grade-bar__stat grade-bar__stat--current">
            <span className="grade-bar__stat-label">{intl.formatMessage(messages.currentGradeLabel)}</span>
            <span className="grade-bar__stat-value" data-testid="currentGradeTooltipContent">{currentGrade}{rtlMark}%</span>
            {hasHiddenGrades && (
              <span className="grade-bar__stat-note">+ {intl.formatMessage(messages.hiddenScoreLabel)}</span>
            )}
          </div>
          <div className="grade-bar__stat grade-bar__stat--passing">
            <span className="grade-bar__stat-label">{intl.formatMessage(messages.passingGradeLabel)}</span>
            <span className="grade-bar__stat-value">{passingGrade}{rtlMark}%</span>
          </div>
        </div>
        <div className="grade-bar__track">
          <div className="grade-bar__fill" style={{ width: `${shownGrade}%` }} />
          <div className="grade-bar__pass-marker" style={{ insetInlineStart: `${passingGrade}%` }} />
        </div>
        <div className="grade-bar__scale">
          {showStartLabel && <span className="grade-bar__scale-end is-at-start">0{rtlMark}%</span>}
          <span className={classNames('grade-bar__pass-label', edgeClass(passingGrade))} style={{ insetInlineStart: `${passingGrade}%` }}>
            {passingGrade}{rtlMark}%
          </span>
          {showEndLabel && <span className="grade-bar__scale-end is-at-end">100{rtlMark}%</span>}
        </div>
      </div>
    </div>
  );
};

GradeBar.propTypes = {
  passingGrade: PropTypes.number.isRequired,
};

export default GradeBar;
