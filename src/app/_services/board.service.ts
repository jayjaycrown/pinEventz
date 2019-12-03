import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

import { Board } from '../_models/board.interface';
import { retry, catchError, tap } from 'rxjs/internal/operators';


const apiUrl = environment.apiBaseUrl + '/board';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    AUTHORIZATION : ' bearer [jwt]'
  })
};
@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }
  // tslint:disable-next-line: variable-name
  private _refreshNeded$ = new Subject<Board>();
  get refreshNeded$() {
    return this._refreshNeded$;
  }

  // tslint:disable-next-line: variable-name
  getBoardById(id: any): Observable<any> {
    return this.http.get<Board>(apiUrl + '/' + id).pipe(
      retry(3), catchError(this.handleError<Board>('getBoard'))
    );
  }

  getBoard(): Observable<any> {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    return this.http.get<Board[]>(apiUrl, httpOptions).pipe(
      retry(3), catchError(this.handleError<Board[]>('getBoard', []))
    );
  }

  addBoard(boardName: string, boardDescription: string, boardCategory: string, boardStatus: string,  profileImage: File) {
    const formData: any = new FormData();
    formData.append('boardName', boardName);
    formData.append('boardDescription', boardDescription);
    formData.append('boardCategory', boardCategory);
    formData.append('boardStatus', boardStatus);
    formData.append('boardUrl', profileImage);
    return this.http.post<Board>(apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError<Board>('addBoard', formData)), tap(() => {
        this._refreshNeded$.next();
      })
    );
  }
  // tslint:disable-next-line: variable-name
  updateBoard(_id: any, board: Board): Observable<Board> {
    return this.http.put<Board>(apiUrl + _id, board, httpOptions).pipe(
      catchError(this.handleError<Board>('updateBoard', board)), tap(() => {
        this._refreshNeded$.next();
      })
    );
  }

  // tslint:disable-next-line: variable-name
  deleteBoard(_id: any): Observable<Board> {
    return this.http.delete<Board>(apiUrl + '/' + _id, httpOptions).pipe(
      catchError(this.handleError<Board>('board', _id)), tap(() => {
        this._refreshNeded$.next();
      })
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
