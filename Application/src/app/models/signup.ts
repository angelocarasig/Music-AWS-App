import { FormControl } from "@angular/forms";

export interface SignupForm {
  email: FormControl<string>;
  user_name: FormControl<string>;
  password: FormControl<string>;
}