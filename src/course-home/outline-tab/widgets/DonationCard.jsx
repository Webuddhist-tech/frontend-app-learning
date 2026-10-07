import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { Launch } from '@openedx/paragon/icons';

import { getDonationData, postDonationClick } from '../../data/api';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';
import '../SidebarCards.scss';

// Links in the school's message open in a new tab, like the button, so
// learners don't leave the course.
const openLinksInNewTab = (html) => {
  if (!html) {
    return html;
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('a[href]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
};

// A school's donation card, linking to the school's own donation page. The LMS
// decides who sees it (enrolled learners, course not ended, school opted in);
// this only skips asking when the answer is known to be no.
const DonationCard = () => {
  const intl = useIntl();
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const {
    isEnrolled,
  } = useModel('courseHomeMeta', courseId);
  const {
    hasEnded,
  } = useModel('outline', courseId);
  const [donation, setDonation] = useState(null);
  const messageHtml = useMemo(() => openLinksInNewTab(donation?.messageHtml), [donation?.messageHtml]);

  useEffect(() => {
    setDonation(null);
    if (!isEnrolled || hasEnded) {
      return undefined;
    }

    let isCurrent = true;
    getDonationData(courseId)
      .then(data => {
        if (isCurrent) {
          setDonation(data);
        }
      })
      .catch(() => {
        /* Do nothing. The card is optional, so it just doesn't show. */
      });
    return () => { isCurrent = false; };
  }, [courseId, isEnrolled, hasEnded]);

  if (!donation?.enabled || !donation.url) {
    return null;
  }

  const {
    showHeading, heading, buttonLabel, url, partnerName,
  } = donation;
  const headingText = heading || intl.formatMessage(messages.donationHeading, { partnerName });
  // Shown unless the school turned it off.
  const isHeadingShown = showHeading !== false;

  const handleClick = () => {
    // Recorded in the background; the link opens without waiting for it.
    postDonationClick(courseId).catch(() => {});
  };

  return (
    <section
      className="mb-4 course-sidebar-card donation-card"
      // Without a visible heading, screen readers still get the card's name.
      aria-label={isHeadingShown ? undefined : headingText}
    >
      {isHeadingShown && <h2 className="h4">{headingText}</h2>}
      {messageHtml && (
        <div
          className="donation-card-message small"
          // Sanitized by the LMS before it is sent.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: messageHtml }}
        />
      )}
      <Button
        as="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        variant="outline-primary"
        iconAfter={Launch}
        onClick={handleClick}
      >
        {buttonLabel || intl.formatMessage(messages.donationButton)}
        <span className="sr-only">{intl.formatMessage(messages.donationOpensNewTab)}</span>
      </Button>
    </section>
  );
};

export default DonationCard;
