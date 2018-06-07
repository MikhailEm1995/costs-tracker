import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from "../../pages/home-page/home-page.component";
import {TrackPageComponent} from "../../pages/track-page/track-page.component";
import {AuthPageComponent} from "../../pages/auth-page/auth-page.component";
import {AuthCallbackComponent} from "../../pages/auth-callback/auth-callback.component";
import {AuthCallbackPageComponent} from "../../pages/auth-callback-page/auth-callback-page.component";

const appRoutes: Routes = [
  { path: 'auth', component: AuthPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'track', component: TrackPageComponent },
  { path: 'auth-callback', component: AuthCallbackPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
