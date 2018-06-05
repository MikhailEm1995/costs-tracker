import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {

  private auth0: any = new auth0.WebAuth({
    clientID: 'GvD2dfwfn14HV88XRUQR8u9TZ0vsj584',
    domain: 'memchenko.auth0.com',
    responseType: 'token id_token',
    audience: 'https://memchenko.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/home',
    scope: 'openid'
  });

  constructor(
    private router: Router
  ) { }

  public login(): void {
    this.auth0.authorize();
  }

}
