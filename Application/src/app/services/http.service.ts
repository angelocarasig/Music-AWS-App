import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { SignupForm } from '../models/signup';
import { FormGroup } from '@angular/forms';
import { LoginForm } from '../models/login';
import { QueryForm } from '../models/query';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class HttpService {
  readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly environment = environment;
  
  registerUser(userInfo: FormGroup<SignupForm>): Observable<any> {
    const payload = {
      email: userInfo.controls.email.value,
      password: userInfo.controls.password.value,
      user_name: userInfo.controls.user_name.value,
    }

    return this.http.post(this.routeUrl(this.environment.login.registerUser), payload);
  }
  
  loginUser(userInfo: FormGroup<LoginForm>): Observable<any> {
    const payload = {
      email: userInfo.controls.email.value,
      password: userInfo.controls.password.value,
    }

    return this.http.post(this.routeUrl(this.environment.login.loginUser), payload);
  }

  queryMusic(queryPayload: FormGroup<QueryForm>): Observable<any> {
    const payload = {
      title: queryPayload.controls.title.value,
      artist: queryPayload.controls.artist.value,
      year: queryPayload.controls.year.value
    }

    return this.http.post(this.routeUrl(this.environment.music.getMusic), payload);
  }

  getUserSubscriptions(): Observable<any> {
    const currentUser = this.authService.getUser()!;
    if (currentUser == null) {
      throw new Error("Currently logged in user could not be found.");
    }

    let params = new HttpParams().set('email', currentUser.email);
    
    return this.http.get(this.routeUrl(this.environment.subscriptions.getMusic), { params }).pipe(
      map((response: any) => response.items.map((item: any) => item.music))
    )
  }

  private routeUrl(endpoint: string): string {
    return this.environment.apiUrl + endpoint;
  }
}