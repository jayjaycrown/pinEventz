import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {

  constructor(public auth: UserService) { }

  collapsed = true;

  ngOnInit() {
  }

}
