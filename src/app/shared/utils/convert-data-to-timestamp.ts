/**
 * Parses hh:mm:ss,sss pattern and returns getTime() (milliseconds)
 */
export const convertTimeToTimestamp = (dateString: string): number => {
  const [time, milliseconds] = dateString.split(',');
  const [hours, minutes, seconds] = time.split(':');

  const date = new Date();

  date.setHours(Number(hours.padStart(2, '0')));
  date.setMinutes(Number(minutes.padStart(2, '0')));
  date.setSeconds(Number(seconds.padStart(2, '0')));

  /**
   * We care only about 3 numbers, otherwise JS adds extra seconds.
   * E.g. you have 6739 milliseconds, which means you are adding an extra 6.7 seconds onto your time.
   */
  date.setMilliseconds(Number(milliseconds.padStart(3, '0').slice(0, 3)));

  return date.getTime();
};
