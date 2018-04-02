import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from "../../pages/home-page/home-page.component";
import {TrackPageComponent} from "../../pages/track-page/track-page.component";

const appRoutes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'track', component: TrackPageComponent },
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
