import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { UserService } from '../../_services/user.service';
import { CreateEventModalComponent } from '../create-event-modal/create-event-modal.component';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {

  constructor(public auth: UserService, private modalService: NgbModal, private router: Router) { }

  collapsed = true;
  boards: any;

  createEvent() {
    this.modalService.open(CreateEventModalComponent, { size: 'lg'});
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
    console.log('logged Out Successfully');
  }

  ngOnInit() {
  }

}
