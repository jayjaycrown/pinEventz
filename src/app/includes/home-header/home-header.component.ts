import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventModalComponent } from '../create-event-modal/create-event-modal.component';
import { BoardModalComponent } from 'src/app/profile/board-modal/board-modal.component';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {

  constructor(public auth: UserService, private modalService: NgbModal) { }

  collapsed = true;

  createEvent(content: any) {
    this.modalService.open(content, { size: 'lg', scrollable: true });
  }
  openBoardModal() {
    this.modalService.open(BoardModalComponent);
  }
  ngOnInit() {
  }

}
