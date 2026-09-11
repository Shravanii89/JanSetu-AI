/**
 * JanSetu AI - Shared Indian Standard Time (IST) Date & Time Formatter
 * Guarantees consistent Asia/Kolkata (UTC+05:30) rendering across all dashboards and roles.
 */

export interface DateFormatOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  includeTimezone?: boolean;
  hour12?: boolean;
}

/**
 * Normalizes any date input (ISO string with or without timezone offset, Date object, or epoch timestamp)
 * into a Date object anchored to the intended moment.
 * If the input string is naive (e.g. '2026-09-06T21:13:00'), it appends '+05:30' so that
 * browsers running in other timezones (UTC, US, UK, etc.) do not misinterpret the local time.
 */
export function parseISTDate(input?: string | number | Date | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  let str = String(input).trim();
  if (!str) return null;

  // If ISO-like timestamp without timezone offset or Z, explicitly anchor as IST (+05:30)
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(str)) {
    str = str.replace(" ", "T") + "+05:30";
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formats date and time explicitly in Indian Standard Time (Asia/Kolkata).
 * E.g., '06 Sep 2026, 09:13 PM IST'
 */
export function formatDateIST(
  input?: string | number | Date | null,
  options: DateFormatOptions = {}
): string {
  const d = parseISTDate(input);
  if (!d) return "N/A";

  const {
    includeTime = true,
    includeSeconds = false,
    includeTimezone = true,
    hour12 = true,
  } = options;

  try {
    const datePart = d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (!includeTime) {
      return datePart;
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12,
    };
    if (includeSeconds) {
      timeOptions.second = "2-digit";
    }

    const timePart = d.toLocaleTimeString("en-IN", timeOptions);
    const tzLabel = includeTimezone ? " IST" : "";

    return `${datePart}, ${timePart}${tzLabel}`;
  } catch {
    return String(input);
  }
}

/**
 * Formats time only in Indian Standard Time.
 * E.g., '09:13 PM IST'
 */
export function formatTimeIST(
  input?: string | number | Date | null,
  includeTimezone = true
): string {
  const d = parseISTDate(input);
  if (!d) return "N/A";

  try {
    const timePart = d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return includeTimezone ? `${timePart} IST` : timePart;
  } catch {
    return String(input);
  }
}
