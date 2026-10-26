import PropTypes from 'prop-types';

import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { OverlayTrigger, Popover } from '@openedx/paragon';

import messages from '../messages';
import gradeLabelPopperConfig from './gradeLabelPopperConfig';

const PassingGradeTooltip = ({ passingGrade, tooltipClassName }) => {
  const intl = useIntl();
  const isLocaleRtl = isRtl(getLocale());

  let passingGradeDirection = passingGrade < 50 ? '' : '-';

  if (isLocaleRtl) {
    passingGradeDirection = passingGrade < 50 ? '-' : '';
  }

  return (
    <>
      <OverlayTrigger
        show
        placement="bottom"
        popperConfig={gradeLabelPopperConfig}
        overlay={(
          <Popover id="minimum-grade-tooltip" className={`bg-primary-500 ${tooltipClassName}`} aria-hidden="true">
            <Popover.Content className="text-white">
              {passingGrade}{isLocaleRtl && '\u200f'}%
            </Popover.Content>
          </Popover>
        )}
      >
        <g>
          <circle cx={`${isLocaleRtl ? 100 - passingGrade : passingGrade}%`} cy="50%" r="8.5" fill="transparent" />
          <circle className="grade-bar--passing" cx={`${isLocaleRtl ? 100 - passingGrade : passingGrade}%`} cy="50%" r="4.5" />
          {/* Upright tick across the bar at the passing grade, shown by brand styles in place of the dot */}
          <g style={{ transform: 'translateY(2.61em)' }}>
            <rect className="grade-bar__passing-marker" x={`${isLocaleRtl ? 100 - passingGrade : passingGrade}%`} y="-5" rx="1.5" />
          </g>
        </g>
      </OverlayTrigger>

      <text
        className="x-small"
        textAnchor={passingGrade < 50 ? 'start' : 'end'}
        x={`${isLocaleRtl ? 100 - passingGrade : passingGrade}%`}
        y="90px"
        style={{ transform: `translateX(${passingGradeDirection}3.4em)` }}
      >
        {intl.formatMessage(messages.passingGradeLabel)}
      </text>
    </>
  );
};

PassingGradeTooltip.defaultProps = {
  tooltipClassName: '',
};

PassingGradeTooltip.propTypes = {
  passingGrade: PropTypes.number.isRequired,
  tooltipClassName: PropTypes.string,
};

export default PassingGradeTooltip;
