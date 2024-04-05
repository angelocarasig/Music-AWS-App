import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { SignupForm } from '../models/signup';
import { FormGroup } from '@angular/forms';
import { LoginForm } from '../models/login';
import { QueryForm } from '../models/query';
import { AuthService } from './auth.service';
import { MusicItem } from '../models/music_item';

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

  // Note: as data in table is normalized to lowercase the values here will also be normalized to receive results regardless of case-sensitivity
  queryMusic(queryPayload: FormGroup<QueryForm>): Observable<any> {
    
    // Some smarts in here: https://stackoverflow.com/a/40560953
    const payload = {
      ...(queryPayload.controls.title.value.trim() !== '' && { title: queryPayload.controls.title.value.toLowerCase() }),
      ...(queryPayload.controls.artist.value.trim() !== '' && { artist: queryPayload.controls.artist.value.toLowerCase() }),
      ...(queryPayload.controls.year.value.trim() !== '' && { year: +queryPayload.controls.year.value }),
    }

    console.log("Payload: ", payload);

    return this.http.post(this.routeUrl(this.environment.music.getMusic), payload);
  }

  getUserSubscriptions(): Observable<any> {
    const currentUser = this.authService.getUser()!;
    if (currentUser == null) {
      throw new Error("Currently logged in user could not be found.");
    }

    let params = new HttpParams().set('email', currentUser.email);
    
    return this.http.get(this.routeUrl(this.environment.subscriptions.getMusic), { params })
    .pipe(
      map((response: any) => response.map((item: any) => this.transformApiResponse(item)))
    );
  }

  addUserSubscription(musicItem: MusicItem): Observable<any> {
    const currentUser = this.authService.getUser()!;
    if (currentUser == null) {
      throw new Error("Currently logged in user could not be found.");
    }

    const payload = {
      user: currentUser,
      music: musicItem,
    }

    return this.http.post(this.routeUrl(this.environment.subscriptions.addMusic), payload);
  }

  deleteUserSubscription(musicItem: MusicItem): Observable<any> {
    const currentUser = this.authService.getUser()!;
    if (currentUser == null) {
      throw new Error("Currently logged in user could not be found.");
    }

    const payload = {
      user: currentUser,
      music: musicItem,
    }

    return this.http.post(this.routeUrl(this.environment.subscriptions.deleteMusic), payload);
  }

  // As boto3 get_batch_items returns { S: {object }} we need to map results
  private transformApiResponse(response: { [key: string]: { S: string } }): any {
    const transformed = {} as any;
    for (const key in response) {
      if (response.hasOwnProperty(key) && response[key].hasOwnProperty('S')) {
        transformed[key] = response[key]['S'];
      }
    }
    return transformed;
  }

  private routeUrl(endpoint: string): string {
    return this.environment.apiUrl + endpoint;
  }
}