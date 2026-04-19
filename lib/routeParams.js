/** Normalize dynamic route params (string | string[] | undefined). */
export function segmentId(param) {
  if (param == null) return '';
  if (Array.isArray(param)) return param[0] ? String(param[0]) : '';
  return String(param);
}
