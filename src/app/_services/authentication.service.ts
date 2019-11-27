import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/internal/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


import { UserDetails } from '../_models/user-details';

const apiUrl = environment.apiBaseUrl + 'auth/signup';
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



export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<UserDetails>;
  public currentUser: Observable<UserDetails>;

constructor(private http: HttpClient) {
  }
}
