import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { EventDetailComponent } from './home/event-detail/event-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardDetailComponent } from './profile/board-detail/board-detail.component';
import { AuthGuard } from './_helpers/auth.guard';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { InterestComponent } from './register/interest/interest.component';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResponseResetComponent } from './response-reset/response-reset.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'request-reset-password',
    component: RequestResetComponent,
  },
  {
      path: 'response-reset-password/:token',
      component: ResponseResetComponent
    },
  {path: 'interest', component: InterestComponent },
  { path: 'event',  canActivate: [AuthGuard],
  children: [
      { path: '', component: HomeComponent,  canActivate: [AuthGuard]  },
      { path: ':eventId', component: EventDetailComponent,  canActivate: [AuthGuard] }
    ]
  },
  { path: 'profile',  canActivate: [AuthGuard],
      children: [
        {path: '', component: ProfileComponent, canActivate: [AuthGuard]},
        {path: 'edit', component: EditProfileComponent, canActivate: [AuthGuard]},
        {path: 'board/:_id', component: BoardDetailComponent, canActivate: [AuthGuard]}
      ]
  },
  {path: '**', redirectTo: 'event', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
