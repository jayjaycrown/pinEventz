import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { EventDetailComponent } from './home/event-detail/event-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardDetailComponent } from './profile/board-detail/board-detail.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'login', component: AuthComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'event',  canActivate: [AuthGuard],
  children: [
      { path: '', component: HomeComponent,  canActivate: [AuthGuard]  },
      { path: ':eventId', component: EventDetailComponent,  canActivate: [AuthGuard] }
    ]
  },
  { path: 'profile',  canActivate: [AuthGuard],
      children: [
        {path: '', component: ProfileComponent},
        {path: 'board/:boardId', component: BoardDetailComponent}
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
