import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { SignupForm } from '../models/signup';
import { FormGroup } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class LoginService {
  readonly http = inject(HttpClient);
  readonly environment = environment;
  
  registerUser(userInfo: FormGroup<SignupForm>): Observable<any> {
    const payload = {
      email: userInfo.controls.email.value,
      password: userInfo.controls.password.value,
      user_name: userInfo.controls.user_name.value,
    }

    return this.http.post(this.routeUrl(this.environment.login.registerUser), payload);
  }

  private routeUrl(endpoint: string): string {
    return this.environment.apiUrl + endpoint;
  }
}