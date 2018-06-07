import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

import * as authLock from 'auth0-lock';

@Injectable()
export class AuthService {

  public static USER_ID: string;
  public static NICKNAME: string;

  private static AUTH_RESULT: any;

  private static lock: authLock.Auth0Lock;

  constructor(
    private router: Router
  ) {}

  private bindGetProfileOnAuth(): void {
    AuthService.lock.on('authenticated', this.onAuth.bind(this));
  }

  private onAuth(authResult): void {
    AuthService.AUTH_RESULT = authResult;

    console.log(authResult);

    this.setSession(authResult);
    this.getUserInfo();
  }

  private getUserInfo(): void {
    const { idTokenPayload: { nickname, sub } } = AuthService.AUTH_RESULT;

    this.router.navigate(['/auth-callback']);

    AuthService.USER_ID = sub;
    AuthService.NICKNAME = nickname;
  }

  public loginFromContainer(container: any): void {
    AuthService.lock = new authLock.Auth0Lock('GvD2dfwfn14HV88XRUQR8u9TZ0vsj584', 'memchenko.auth0.com', {
      container,
      auth: {
        responseType: 'token id_token'
      }
    });

    this.bindGetProfileOnAuth();

    AuthService.lock.show();
  }

  public setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.router.navigate(['/auth']);
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
