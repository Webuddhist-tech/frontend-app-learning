import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Locked as LockedIcon } from '@openedx/paragon/icons';
import { Practice, Reading, Video } from '@src/generic/WbaIcons';

export const UNIT_ICON_TYPES = {
  video: 'video',
  problem: 'problem',
  vertical: 'vertical',
  lock: 'lock',
  other: 'other',
};

const UnitIcon = ({ type, isCompleted, ...props }) => {
  // The design's outline icons have no "complete" variant; completion shows
  // through the text-success color instead. Lock has no design icon.
  const iconMap = {
    [UNIT_ICON_TYPES.video]: Video,
    [UNIT_ICON_TYPES.problem]: Practice,
    [UNIT_ICON_TYPES.vertical]: Reading,
    [UNIT_ICON_TYPES.lock]: LockedIcon,
    [UNIT_ICON_TYPES.other]: Reading,
  };

  const Icon = iconMap[type || UNIT_ICON_TYPES.other];

  return (
    <Icon {...props} className={classNames({ 'text-success': isCompleted, 'text-gray-300': !isCompleted })} />
  );
};

UnitIcon.propTypes = {
  type: PropTypes.oneOf(Object.keys(UNIT_ICON_TYPES)).isRequired,
  isCompleted: PropTypes.bool.isRequired,
};

export default UnitIcon;
