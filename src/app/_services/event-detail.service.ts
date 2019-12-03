import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import {catchError, retry} from 'rxjs/internal/operators';



import { EventDetails } from '../_models/event-details';
import { environment } from 'src/environments/environment.prod';

const apiUrl = environment.userBaseUrl + '/event';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'jwt-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EventDetailService {
  constructor(private http: HttpClient) {}

  getEventById(id: any): Observable<any> {
    return this.http.get<EventDetails>(apiUrl + id).pipe(
      retry(3), catchError(this.handleError<EventDetails>('getEvent'))
      );
   }


  getEvent(): Observable<any> {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    return this.http.get<EventDetails[]>(apiUrl, httpOptions).pipe(
      retry(3), catchError(this.handleError<EventDetails[]>('getEvent', []))
      );
  }

  addEvent(eventDetails: EventDetails) {
    return this.http.post<EventDetails>(apiUrl, eventDetails, httpOptions).pipe(
      catchError(this.handleError('addEvent', eventDetails))
    );
  }

  updateEvent(id: any, eventDetail: EventDetails): Observable<EventDetails> {
    return this.http.put<EventDetails>(apiUrl + id, eventDetail, httpOptions)
      .pipe(
        catchError(this.handleError('updateEvent', eventDetail))
      );
  }

  deleteEvent(id: any): Observable<EventDetails> {
    return this.http.delete<EventDetails>(apiUrl + id, httpOptions)
      .pipe(
        catchError(this.handleError('eventDetail', id))
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
