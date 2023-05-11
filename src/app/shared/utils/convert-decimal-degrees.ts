/**
 * Converts decimal degrees to degrees, minutes, and seconds format.
 *
 * @param decimalDegrees
 */
export const convertDecimalDegrees = (decimalDegrees: number) => {
  const degrees = Math.floor(decimalDegrees);

  const minutesDecimal = (decimalDegrees - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);

  const seconds = (minutesDecimal - minutes) * 60;
  const secondsRounded = parseFloat(seconds.toFixed(2));

  // eslint-disable-next-line @typescript-eslint/quotes
  return degrees + '° ' + minutes + "' " + secondsRounded + '"';
};
