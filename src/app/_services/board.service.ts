import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

import { Board } from '../_models/board.interface';
import { retry, catchError, tap } from 'rxjs/internal/operators';


const apiUrl = environment.userBaseUrl + '/board';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'jwt-token'
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

  getBoardById(id: any): Observable<any> {
    return this.http.get<Board>(apiUrl + id).pipe(
      retry(3), catchError(this.handleError<Board>('getBoard'))
    );
  }

  getBoard(): Observable<any> {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    return this.http.get<Board[]>(apiUrl, httpOptions).pipe(
      retry(3), catchError(this.handleError<Board[]>('getBoard', []))
    );
  }

  addBoard(board: Board) {
    return this.http.post<Board>(apiUrl, board, httpOptions).pipe(
      catchError(this.handleError<Board>('addBoard', board)), tap(() => {
        this._refreshNeded$.next();
      })
    );
  }
  updateBoard(id: any, board: Board): Observable<Board> {
    return this.http.put<Board>(apiUrl + id, board, httpOptions).pipe(
      catchError(this.handleError<Board>('updateBoard', board)), tap(() => {
        this._refreshNeded$.next();
      })
    );
  }

  deleteBoard(id: any): Observable<Board> {
    return this.http.delete<Board>(apiUrl + id, httpOptions).pipe(
      catchError(this.handleError<Board>('board', id)), tap(() => {
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
