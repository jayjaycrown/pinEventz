import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';


import { EventDetailService } from '../../_services/event-detail.service';
import { EventDetails } from '../../_models/event-details';
import { UserService } from 'src/app/_services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})

export class EventDetailComponent implements OnInit {
  constructor(
              config: NgbModalConfig,
              private route: ActivatedRoute,
              private evDet: EventDetailService,
              private modalService: NgbModal,
              public userService: UserService,
              public orderPipe: OrderPipe) {
                config.backdrop = 'static';
               }
  reverse = true;
  events: EventDetails;
   organizer: any;
   user: any;

  id = this.route.snapshot.paramMap.get('eventId');

comments: any;
  showEdit = false;
model = {
  text: ''
};

  open(content) {
    this.modalService.open(content, { scrollable: true });
  }
  editEvent(edit) {
    this.modalService.open(edit, {scrollable: true});
  }
  onSubmit(form: NgForm) {
    this.model.text = '';
    this.evDet.postComment(form.value, this.id).subscribe(data => {
      // console.log(data);
    });
  }
  delete() {}

  // updateEvent(id: any) {
  //   this.evDet
  //     .updateEvent(id, this.postdata)
  //     .subscribe(resp => {
  //       return this.spresp.push(resp);
  //     });
  // }
  getUser() {
    this.user = localStorage.getItem('user');
    // console.log('UserId is: ' + this.user);
    return this.user;
}

getEventById() {
  this.route.paramMap.subscribe(
    paramMap => {
      this.evDet.getEventById(paramMap.get('eventId')).subscribe(data => {
        // console.log(data);
        this.events = data;
        this.comments = data.comments;
       // console.log(this.comments);
        // console.log( this.comments.created_dt);
        this.organizer = data.organizer;
        console.log( 'Organizer Id' + this.organizer[0].id);
        console.log('User Id' + this.user);
        if (this.organizer[0].id ===  this.user) {
          this.showEdit = !this.showEdit;
        }
        console.log(this.showEdit);
      });
    }
  );
}

  ngOnInit() {
    this.evDet.refreshNeded$.subscribe(() => {
      this.getEventById();
    });
    this.getEventById();
    this.getUser();
    // console.log('Organizer Id' + this.organizer[0].id);
    // console.log('User Id' + this.user);


  }


  //   if (this.id != null) {
  //    console.log('id: ' + this.id);
  //  }

}
