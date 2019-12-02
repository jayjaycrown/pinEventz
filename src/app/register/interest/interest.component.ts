import { Component, OnInit } from '@angular/core';

import { InterestService } from '../../_services/interest.service';
import { Interest } from '../../_models/interest';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {

  interests: Interest[] = [];
  constructor(private interestService: InterestService) { }

  getInterest() {
    this.interestService.getInterests().subscribe(
      data => {
        console.log(data);
        this.interests = data;
      }
    );
  }

  onClickSubmit(formData: Interest) {
    console.log(formData);
    this.interestService.addInterest(formData).subscribe(
      data => {
        console.log(data);
        this.interests.push(data);
      }
    );
  }

  ngOnInit() {
    this.getInterest();
  }

}
