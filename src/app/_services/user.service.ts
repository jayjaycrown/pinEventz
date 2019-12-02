import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/internal/operators';
import { of, Observable } from 'rxjs';

import { UserDetails } from '../_models/user-details';
import { Router } from '@angular/router';

const apiUrl = environment.apiBaseUrl ;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/fhir+json',
    AUTHORIZATION : ' bearer [jwt]'
  })
};


@Injectable({
  providedIn: 'root'
})



export class UserService {
  token: string;

selectedUser: UserDetails[];

noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };

constructor(private http: HttpClient, private router: Router) { }
register(user: UserDetails) {
    return this.http.post<UserDetails>(apiUrl + '/register', user, this.noAuthHeader)
    .pipe(
      catchError(this.handleError('register', user))
    );
  }

  login(authCredentials: any) {
    return this.http.post(apiUrl + '/login', authCredentials, httpOptions)
    .pipe(
      catchError(this.handleError('login', authCredentials))
    );
  }

  profile() {
    return this.http.get(apiUrl + '/profile').pipe(
      retry(3), catchError(this.handleError('profile'))
    );
  }

  logout() {
    window.localStorage.removeItem('token');
    this.router.navigateByUrl('/');
    return this.http.get(apiUrl + '/logout');

  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }
  public isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
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
