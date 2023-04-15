import { Parameter } from './parameter';

export type ParametersByName = Record<Parameter['name'], Partial<Parameter>>;
