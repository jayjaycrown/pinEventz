import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry, tap  } from 'rxjs/operators';

import { UserService } from '../_services/user.service';
import { Observable, throwError } from 'rxjs';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: UserService, private router: Router) {}
    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
                const idToken = localStorage.getItem('id_token');
                if (idToken) {
                  const cloned = req.clone({
                      headers: req.headers.set('Authorization', 'Bearer ' + idToken),
                  });
                  return next.handle(cloned).pipe(tap((event: HttpEvent<any>) => {}, (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                      if (error.status === 401 || error.status === 403) {
                        this.auth.logout();
                    }
                    }
                  }));


              } else {
                console.log(req);
                return next.handle(req);

              }
  }



}
