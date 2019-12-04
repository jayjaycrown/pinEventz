import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventDetailService } from '../_services/event-detail.service';
import { EventDetails } from '../_models/event-details';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  eventDetails: EventDetails[] = [];
  headers: any;
  spresp: any;
  postdata: EventDetails;
  eventId: any;


  constructor(private evDet: EventDetailService) { }

  getEvents() {
    this.evDet.getEvent().subscribe(
      data => {
        console.log(data);
        this.eventDetails = data;
      }
    );
  }

  getEventById(id: any) {
    this.evDet.getEventById(id)
      .subscribe(data => {
        console.log(data);
        this.eventId = data;
      });
  }

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
    this.getEvents();
  }

  ngOnDestroy() {

  }
}
