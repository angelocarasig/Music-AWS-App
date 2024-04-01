import { FormControl } from "@angular/forms";

export interface QueryForm {
  title: FormControl<string>;
  artist: FormControl<string>;
  year: FormControl<string>;
}