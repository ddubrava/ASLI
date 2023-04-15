import { Data } from './data';
import { ParametersByName } from './parameters-by-name';

export interface StatisticsMessage {
  data: Data;
  parameters: ParametersByName;
}
