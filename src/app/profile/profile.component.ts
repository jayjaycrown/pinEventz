import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Board } from '../_models/board.interface';
import { BoardService } from '../_services/board.service';
import { BoardModalComponent } from './board-modal/board-modal.component';
import { UserService } from '../_services/user.service';
import { UserDetails } from '../_models/user-details';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private boardDet: BoardService,
              private modalService: NgbModal,
              private details: UserService,
              private route: ActivatedRoute) { }
  boardDetails: Board[] = [];
  headers: any;
  spresp: any;
  postdata: Board;
  boardId: any;

  users;
  currentJustify = 'fill';
  profileDetails;

  getBoards() {
    this.boardDet.getBoard().subscribe(
      data => {
        console.log(data);
        this.boardDetails = data;
      }
    );
  }

   getConfirmation(id: any) {
    const retVal = confirm('Are you sure you really want to delete this Board?');
    if ( retVal === true ) {
      this.deleteBoard(id);
      return true;
    } else {
       return false;
    }
 }

  deleteBoard(id: any) {
    this.boardDet.deleteBoard(id).subscribe(
      data => {
        return this.boardDetails.push(data);
      }
    );
  }
  ngOnInit() {


    this.route.paramMap.subscribe(
      paramMap => {
        this.details.profile().subscribe(
          data => {
            console.log(data);
            this.profileDetails = data;
            console.log(this.profileDetails);
          }
        );
      }
    );


    this.boardDet.refreshNeded$.subscribe(() => {
      this.getBoards();
    });
    this.getBoards();
  }

  // ngOnDestroy() {
  //   this.boardDet.refreshNeded$.unsubscribe();
  // }

  openModal() {
    const modalRef = this.modalService.open(BoardModalComponent);
  }
}