import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, retry, tap  } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
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
  // tslint:disable-next-line: variable-name
  private _refreshNeded$ = new Subject<UserDetails>();
  get refreshNeded$() {
    return this._refreshNeded$;
  }

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
  editProfile(email: string, fullName: string, cityCountry: string, dateOfBirth: string,
              gender: string, password: string, profileImage: File) {
    const formData: any = new FormData();
    formData.append('email', email);
    formData.append('fullName', fullName);
    formData.append('cityCountry', cityCountry);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('gender', gender);
    formData.append('password', password);
    formData.append('profileUrl', profileImage);
    httpOptions.headers = httpOptions.headers.set('Access-Control-Allow-Origin', '*');
    return this.http.put(apiUrl + '/editprofile', formData, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(
      catchError(this.handleError<UserDetails>('editProfile', formData)), tap(() => {
        this._refreshNeded$.next();
      })

    );
  }

  logout() {
    this.isLoggedOut();
    localStorage.removeItem('id_token');
    window.localStorage.removeItem('user');
    localStorage.removeItem('expires_at');
    alert('Logging out now');
    location.reload();
  }
  public issLoggedIn() {
    const userToken = this.getToken();
    if (userToken) {
      // console.log(userToken);
      return true ;
    } else {
      return false;
    }
  }

  // public isLoggedIn() {
  //   const abc = moment().isBefore(this.getExpiration());
  //   console.log(abc);
  //   return moment().isBefore(this.getExpiration());
  // }

  isLoggedOut() {
    return !this.issLoggedIn();
  }

  // getExpiration() {
  //   const expiration = localStorage.getItem('expires_at');
  //   const expiresAt = JSON.parse(expiration);
  //   return moment(expiresAt);
  // }

  setUser(user: string) {
    localStorage.setItem('user', user);
  }
  // setToken(token: string) {
  //   localStorage.setItem('token', token);

  // }
  getUser() {
      this.user = localStorage.getItem('user');
      return this.user;
  }
  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('id_token');
    }
    return this.token;
  }


  requestReset(body): Observable<any> {
    return this.http.post(`${apiUrl}/resetpassword`, body) .pipe(
      catchError(this.handleError<UserDetails>('requestReset', body)), tap(() => {
        this._refreshNeded$.next();
      })

    );
  }

  newPassword(body): Observable<any> {
    return this.http.post(`${apiUrl}/new-password`, body)
    .pipe(
      catchError(this.handleError<UserDetails>('newPassword', body)), tap(() => {
        this._refreshNeded$.next();
      })

    );
  }

  ValidPasswordToken(body): Observable<any> {
    return this.http.post(`${apiUrl}/valid-password-token`, body) .pipe(
      catchError(this.handleError<UserDetails>('ValidPasswordToken', body)), tap(() => {
        this._refreshNeded$.next();
      })

    );
  }


  // getUserPayload() {
  //   const token = this.getToken();
  //   if (token) {
  //     const userPayload = atob(token.split('.')  [1]);
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
