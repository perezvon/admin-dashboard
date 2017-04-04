/* eslint-disable */
export function currToNumber(string) {
  return Number(string.replace(/[^0-9\.]+/g, ""))
}
