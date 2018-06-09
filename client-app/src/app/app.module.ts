import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { WidgetComponent } from './components/widget/widget.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { WidgetPageComponent } from './pages/widget-page/widget-page.component';
import { TrackPageComponent } from './pages/track-page/track-page.component';
import { NewWidgetPageComponent } from './pages/new-widget-page/new-widget-page.component';
import {FormsModule} from '@angular/forms';
import { PlotWidgetComponent } from './components/plot-widget/plot-widget.component';
import { TextWidgetComponent } from './components/text-widget/text-widget.component';
import { CapitalizePipe } from './pipes/capitalize/capitalize.pipe';
import {AppRoutingModule} from './modules/app-routing/app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {UserCategoriesService} from './services/user-categories/user-categories.service';
import { LayoutComponent } from './components/layout/layout.component';
import {NotificationsService} from './services/notifications/notifications.service';
import {TracksService} from './services/tracks/tracks.service';
import {AuthService} from './services/auth/auth.service';
import { AuthCallbackPageComponent } from './pages/auth-callback-page/auth-callback-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    WidgetComponent,
    AuthPageComponent,
    WidgetPageComponent,
    TrackPageComponent,
    NewWidgetPageComponent,
    PlotWidgetComponent,
    TextWidgetComponent,
    CapitalizePipe,
    LayoutComponent,
    AuthCallbackPageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    UserCategoriesService,
    NotificationsService,
    TracksService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
