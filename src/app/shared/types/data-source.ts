export interface DataSource {
  /**
   * Time in milliseconds (Date.getTime)
   */
  x: number;
  /**
   * Parameter value
   */
  y: number;
  /**
   * Parameter name
   */
  name: string;
  /**
   * Time without formatting
   */
  time: string;
}
