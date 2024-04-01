import { Injectable } from '@angular/core';

import { User } from '../models/user';

const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Returns the currently logged in user's email.
   */
  getUser(): User | null {
    try {
      return JSON.parse(sessionStorage.getItem(USER_KEY)!);
    } 
    catch {
      return null;
    }
  }

  saveUser(user: User): void {
    const payload = {
      email: user.email,
      user_name: user.user_name
    }
    
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload))
  }

  logoutUser(): void {
    sessionStorage.removeItem(USER_KEY);
  }
}
