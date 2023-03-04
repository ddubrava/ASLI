import { Data } from './data';
import { Parameter } from './parameter';
import { DataZoom } from './data-zoom';

export interface StatisticsMessage {
  data: Data[];
  parameters: Parameter[];
}
