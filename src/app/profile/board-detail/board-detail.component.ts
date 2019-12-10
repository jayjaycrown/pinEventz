import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../_services/board.service';
import { Board } from '../../_models/board.interface';
import { EventDetailService } from '../../_services/event-detail.service';
import { CreateEventModalComponent } from 'src/app/includes/create-event-modal/create-event-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  event: any;
  reverse = true;
  pinned: any;
  PinnedEvents: any = [];

  constructor(private route: ActivatedRoute, private modalService: NgbModal,
              private boardService: BoardService, private eventDetail: EventDetailService) { }
  board: Board;
// element: any;
createEvent() {
  this.modalService.open(CreateEventModalComponent, { size: 'lg'});
}

unpin() {
  alert('Working on it');
}
  ngOnInit() {
    this.route.paramMap.subscribe(
      paramMap => {
        this.boardService.getBoardById(paramMap.get('_id')).subscribe(
          data => {
            console.log(data);
            this.board = data;
            this.pinned = data.events;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.pinned.length; i++) {
               // tslint:disable-next-line: no-shadowed-variable
               const pins = this.pinned[i];
               // console.log(element);
               this.eventDetail.getEventById(pins).subscribe(
                 el => {
                   this.PinnedEvents.push(el);
                   console.log(this.PinnedEvents);
                 }
               );
            }
          }
        );
      }
    );

    // console.log(this.element);
  }

}
