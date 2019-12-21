import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from '../_services/user.service';
import { from } from 'rxjs';
@Injectable({ providedIn: 'root'})
export class AuthGuard  {
   constructor(private router: Router, private authService: UserService) {}
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const currentUser = this.authService.currentUserValue;
  //   if (currentUser) {
  //     return true;

  //   }
  //   this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
  // }
  canActivate(state: RouterStateSnapshot) {
    if (this.authService.isLoggedOut()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }
}
