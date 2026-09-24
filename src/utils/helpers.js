/**
 * Correctly parses UTC date strings from the backend into a Javascript Date object.
 * Fixes timezone offset discrepancies (e.g. UTC server to local browser IST).
 */
export const parseUtcDate = (dateVal) => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return dateVal;
  if (Array.isArray(dateVal)) {
    const [y, m, d, h = 0, min = 0, s = 0] = dateVal;
    return new Date(Date.UTC(y, m - 1, d, h, min, s));
  }
  let str = String(dateVal).trim();
  if (!str) return null;
  // If no timezone suffix (no Z and no offset +/-), append Z to treat as UTC
  if (!str.endsWith('Z') && !str.includes('+') && !/-\d\d:\d\d$/.test(str)) {
    str = str + 'Z';
  }
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Formats a log timestamp to the user's local timezone with 12-hour AM/PM format.
 */
export const formatLogTimestamp = (dateVal) => {
  const date = parseUtcDate(dateVal);
  if (!date) return String(dateVal || '-');
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Formats time only in local timezone with AM/PM.
 */
export const formatTimeOnly = (dateVal) => {
  const date = parseUtcDate(dateVal);
  if (!date) return String(dateVal || '-');
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};
