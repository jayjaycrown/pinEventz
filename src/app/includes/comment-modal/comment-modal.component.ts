import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { EventDetailService } from 'src/app/_services/event-detail.service';


@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {
  comments: any;
  organizer: any;
  id = this.route.snapshot.paramMap.get('id');

  constructor(private route: ActivatedRoute, private evDet: EventDetailService) { }

  ngOnInit() {

    // console.log('id: ' + this.id);
    // this.route.paramMap.subscribe(
    //   paramMap => {
    //     this.evDet.getEventById(paramMap.get('eventId')).subscribe(data => {
    //       console.log(data);
    //       this.comments = data.comment;
    //       console.log(data.comment);

    //       this.organizer = data.organizer;
    //       console.log(this.organizer);
    //     });
    //   }
    // );
  }

}
