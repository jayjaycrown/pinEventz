import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment.prod';
import { Interest } from '../_models/interest';
import { retry, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const userUrl = environment.userBaseUrl ;
const  apiUrl = environment.apiBaseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'jwt-token'
  })
};
@Injectable({
  providedIn: 'root'
})
export class InterestService {

  constructor(private http: HttpClient) { }
  getInterests(): Observable<any> {
    return this.http.get<Interest>(userUrl + '/interests').pipe(
      retry(3), catchError(this.handleError<Interest>('getInterests' ))
    );
  }

  addInterest(interests: Interest) {
    return this.http.post<Interest>(apiUrl + '/interest', interests, httpOptions).pipe(
      catchError(this.handleError<Interest>('addInterest', interests))
    );
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
