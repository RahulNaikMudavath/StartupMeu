/**
 * Validates a URL string.
 * Returns true if the value is falsy (field is optional) or if it can be
 * parsed by the URL constructor. Returns false for malformed URLs.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns true if the value contains at least one non-whitespace character.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isNonBlank(value) {
  return value.trim().length > 0;
}
