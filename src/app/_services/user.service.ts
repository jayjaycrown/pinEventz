import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { catchError, retry, tap  } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
// import * as jwt_decode from 'jwt-decode';
import { UserDetails } from '../_models/user-details';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { shareReplay } from 'rxjs/operators';

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
      catchError(this.handleError('Register', user))
    );
  }

  login(authCredentials: any) {
    return this.http.post(apiUrl + '/login', authCredentials, httpOptions)
    .pipe(tap(res => this.setSession(res)), shareReplay(),
      catchError(this.handleError('Login', authCredentials))
    );
  }
  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
}
  // getTokenDetails() {
  //   const token = this.getToken();
  //   const decoded = jwt_decode(token);
  //   console.log(decoded);
  //   return decoded.UserId;
  // }



  profile() {
    return this.http.get(apiUrl + '/profile', httpOptions).pipe(
      retry(3), catchError(this.handleError('profile'))
    );
  }

  logout() {
    localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    localStorage.removeItem('expires_at');
    alert('Logging out now');
    location.reload();
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  expiresIn(expiresIn) {

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



  // public isLoggedIn() {
  //   const userToken = this.getToken();
  //   if (userToken) {
  //     return true ;
  //   } else {
  //     return false;
  //   }
  // }

  // getUserPayload() {
  //   const token = this.getToken();
  //   if (token) {
  //     const userPayload = atob(token.split('.')[1]);
  //     return JSON.parse(userPayload);
  //   } else {
  //     return null;
  //   }
  // }










  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.error.message}`);
      // alert(error);
      return of(result as T);
    };
  }

  private log(message: string) {

    console.log(message);
    alert(message);
  }

}
