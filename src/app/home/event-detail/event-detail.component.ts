import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventDetailService } from '../../_services/event-detail.service';
import { EventDetails } from '../../_models/event-details';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})

export class EventDetailComponent implements OnInit {

  events: EventDetails;

  constructor(private route: ActivatedRoute, private evDet: EventDetailService) { }



  ngOnInit() {
    this.route.paramMap.subscribe(
      paramMap => {
        this.evDet.getEventById(paramMap.get('eventId')).subscribe(data => {
          console.log(data);
          this.events = data;
        });
      }
    );

  }

}
