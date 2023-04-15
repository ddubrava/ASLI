import { FormControl } from '@angular/forms';
import { Parameter } from './parameter';

export type ParametersForm = {
  [Key in keyof Parameter]: FormControl<Parameter[Key]>;
};
