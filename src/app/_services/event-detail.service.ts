import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import {catchError, retry, tap} from 'rxjs/internal/operators';



import { EventDetails } from '../_models/event-details';
import { environment } from '../../environments/environment';


const apiUrl = environment.apiBaseUrl + '/event';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    AUTHORIZATION : ' bearer [jwt]'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EventDetailService {
  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: variable-name
  private _refreshNeded$ = new Subject<EventDetails>();
  get refreshNeded$() {
    return this._refreshNeded$;
  }
  getEventById(id: any): Observable<any> {
    return this.http.get<EventDetails>(apiUrl + '/' + id).pipe(
      retry(3), catchError(this.handleError<EventDetails>('getEvent'))
      );
   }


  getEvent(): Observable<any> {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    return this.http.get<EventDetails[]>(apiUrl, httpOptions).pipe(
      retry(3), catchError(this.handleError<EventDetails[]>('getEvent', []))
      );
  }

  // tslint:disable-next-line: max-line-length
  addEvent(eventName: string, address: string, shortDes: string, fullDes: string, eventImage: File, startDate: string, finishDate: string, board: string, status: string, category: string,   time: string,  ) {
    const formData: any = new FormData();
    formData.append('eventName', eventName);
    formData.append('address', address);
    formData.append('shortDes', shortDes);
    formData.append('fullDes', fullDes);
    formData.append('eventUrl', eventImage);
    formData.append('startDate', startDate);
    formData.append('finishDate', finishDate);
    formData.append('board', board);
    formData.append('status', status);
    formData.append('category', category);
    formData.append('time', time);
    return this.http.post<EventDetails>(apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError<EventDetails>('addEvent', formData)), tap(() => {
        this._refreshNeded$.next();
      })
    );
  }


  updateEvent(id: any, eventDetail: EventDetails): Observable<EventDetails> {
    return this.http.put<EventDetails>(apiUrl + id, eventDetail, httpOptions)
      .pipe(
        catchError(this.handleError('updateEvent', eventDetail))
      );
  }

  deleteEvent(id: any): Observable<EventDetails> {
    return this.http.delete<EventDetails>(apiUrl + '/' + id, httpOptions)
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
    alert(message);
  }
 }
