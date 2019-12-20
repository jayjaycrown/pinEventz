import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventDetailService } from '../_services/event-detail.service';
import { EventDetails } from '../_models/event-details';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventModalComponent } from '../includes/create-event-modal/create-event-modal.component';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  users: any;
  reverse = true;
  eventDetails: EventDetails[] = [];
  headers: any;
  spresp: any;
  postdata: EventDetails;
  eventId: any;
  collapsed = true;
  searchText: any;


  constructor(private evDet: EventDetailService,
              private modalService: NgbModal,
              private auth: UserService,
              private router: Router) { }

  createEvent() {
    this.modalService.open(CreateEventModalComponent, { size: 'lg'});
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
    console.log('logged Out Successfully');
  }
  getEvents() {
    this.evDet.getEvent().subscribe(
      data => {
        // console.log(data);
        this.eventDetails = data;
      }
    );
  }
  pinEvent(content) {
    this.modalService.open(content);
  }
  // getEventById(id: any) {
  //   this.evDet.getEventById(id)
  //     .subscribe(data => {
  //       console.log(data);
  //       this.eventId = data;
  //     });
  // }

  // addEvent() {
  //   this.evDet
  //     .addEvent(this.postdata)
  //     .subscribe(resp => {
  //       return this.spresp.push(resp);
  //     });
  // }

  // updateEvent(id: any) {
  //   this.evDet
  //     .updateEvent(id, this.postdata)
  //     .subscribe(resp => {
  //       return this.spresp.push(resp);
  //     });
  // }

  deleteEvent(id: any) {
    this.evDet
      .deleteEvent(id)
      .subscribe(resp => {
        return this.spresp.push(resp);
      });
  }

  ngOnInit() {
    this.evDet.refreshNeded$.subscribe(() => {
      this.getEvents();
    });
    this.getEvents();

    this.auth.profile().subscribe(res => {
      // tslint:disable-next-line: no-string-literal
      this.users = res['user'];
    }, (err) => {
      console.error(err);
    });
  }

  ngOnDestroy() {

  }
}
