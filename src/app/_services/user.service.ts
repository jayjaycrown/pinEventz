import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/internal/operators';
import { of, Observable } from 'rxjs';

import { UserDetails } from '../_models/user-details';
import { Router } from '@angular/router';

const apiUrl = environment.apiBaseUrl ;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/fhir+json',
    Authorization: 'jwt-token'
  })
};


@Injectable({
  providedIn: 'root'
})



export class UserService {
  token: string;

selectedUser: UserDetails[];


constructor(private http: HttpClient, private router: Router) { }
register(user: UserDetails) {
    return this.http.post<UserDetails>(apiUrl + '/register', user, httpOptions)
    .pipe(
      catchError(this.handleError('register', user))
    );
  }

  login(authCredentials: any) {
    return this.http.post(apiUrl + '/login', authCredentials, httpOptions);
  }
  logout() {
    window.localStorage.removeItem('token');
    this.router.navigateByUrl('/');
    return this.http.get(apiUrl + '/logout');

  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      return true;
    } else {
      return null;
    }
  }












  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

}
