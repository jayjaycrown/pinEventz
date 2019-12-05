import { Component, OnInit  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { Board } from '../_models/board.interface';
import { BoardService } from '../_services/board.service';
import { BoardModalComponent } from './board-modal/board-modal.component';
import { UserService } from '../_services/user.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private boardDet: BoardService,
              private modalService: NgbModal,
              private details: UserService,
              private Spinner: NgxSpinnerService) { }
  boardDetails: Board[] = [];
  headers: any;
  spresp: any;
  postdata: Board;
  boardId: any;

  users;
  currentJustify = 'fill';
  profileDetails;

  getBoards() {
    this.Spinner.show();
    // this.SpinnerService.show();
    this.boardDet.getBoard().subscribe(
      data => {
        console.log(data);
        this.boardDetails = data;
        this.Spinner.hide();
      }
    );
  }

   getConfirmation(id: any) {
    const retVal = confirm('Are you sure you really want to delete this Board?');
    if ( retVal === true ) {
      return this.deleteBoard(id);
    } else {
       return false;
    }
 }

  deleteBoard(id: any) {
    this.Spinner.show();
    this.boardDet.deleteBoard(id).subscribe(
      data => {
        this.Spinner.hide();
        return this.boardDetails.push(data);
      }
    );
  }
  ngOnInit() {
    this.Spinner.show();

    this.details.profile().subscribe(res => {
        // console.log(res);
        // tslint:disable-next-line: no-string-literal
        this.users = res['user'];
      }, (err) => {
        console.error(err);
      });

    this.boardDet.refreshNeded$.subscribe(() => {
      this.getBoards();
    });
    this.getBoards();
    this.Spinner.hide();
  }

  // ngOnDestroy() {
  //   this.boardDet.refreshNeded$.unsubscribe();
  // }

  openModal() {
    const modalRef = this.modalService.open(BoardModalComponent);
  }
}
