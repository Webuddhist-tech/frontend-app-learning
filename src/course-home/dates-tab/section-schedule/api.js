import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

export const getSectionScheduleUrl = (courseId) => `${getConfig().LMS_BASE_URL}/api/course-schedule/v1/${courseId}/`;

/**
 * The course's section schedule (sherab-custom-plugin `course_schedule` app).
 *
 * Never throws: the schedule is optional, so any failure just means there are
 * no sessions to show. A missing plugin (404), a user who can't see the course
 * (401/403) are expected and silent; anything else (a server error, a network
 * failure) is logged so a broken endpoint doesn't go unnoticed.
 */
export async function getSectionSchedule(courseId) {
  try {
    const { data } = await getAuthenticatedHttpClient().get(getSectionScheduleUrl(courseId));
    return camelCaseObject(data);
  } catch (error) {
    if (![401, 403, 404].includes(error?.response?.status)) {
      logError(error);
    }
    return { enabled: false, sessions: [] };
  }
}
