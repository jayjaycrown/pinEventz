import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpErrorInterceptor } from './_helpers/HttpErrorInterceptor';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './includes/header/header.component';
import { HomeHeaderComponent } from './includes/home-header/home-header.component';
import { HomeFooterComponent } from './includes/home-footer/home-footer.component';
import { EventDetailComponent } from './home/event-detail/event-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardDetailComponent } from './profile/board-detail/board-detail.component';
import { BoardModalComponent } from './profile/board-modal/board-modal.component';
import { ConpareValidatorDirective } from './_helpers/conpare-validator.directive';
import { CreateEventModalComponent } from './includes/create-event-modal/create-event-modal.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { InterestComponent } from './register/interest/interest.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    RegisterComponent,
    HeaderComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    EventDetailComponent,
    ProfileComponent,
    BoardDetailComponent,
    BoardModalComponent,
    ConpareValidatorDirective,
    CreateEventModalComponent,
    EditProfileComponent,
    InterestComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    BoardModalComponent,
    CreateEventModalComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
