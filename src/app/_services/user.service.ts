import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError, retry } from 'rxjs/internal/operators';
import { of, Observable } from 'rxjs';

import * as jwt_decode from 'jwt-decode';

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
  user: string;

selectedUser: UserDetails[];
// tslint:disable-next-line: variable-name
//  _id = this.getTokenDetails();

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
  // getTokenDetails() {
  //   const token = this.getToken();
  //   const decoded = jwt_decode(token);
  //   console.log(decoded);
  //   return decoded.UserId;
  // }


  // tslint:disable-next-line: variable-name
  // profile(_id: string) {
  //   return this.http.get(apiUrl + '/user/' + _id, httpOptions).pipe(
  //     retry(3), catchError(this.handleError('profile'))
  //   );
  // }

  profile() {
    return this.http.get(apiUrl + '/profile', httpOptions).pipe(
      retry(3), catchError(this.handleError('profile'))
    );
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
    // return this.http.get(apiUrl + '/logout');

  }
  setUser(user: string) {
    localStorage.setItem('user', user);
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
