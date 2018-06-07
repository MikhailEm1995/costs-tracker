import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-auth-callback-page',
  templateUrl: './auth-callback-page.component.html',
  styleUrls: ['./auth-callback-page.component.scss']
})
export class AuthCallbackPageComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {}

}
