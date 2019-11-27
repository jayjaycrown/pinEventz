import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } from '../_services/user.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  model = {
    email: '',
    password: ''
  };

  serverErrorMessages: string;
  ngOnInit() {
  }
  onSubmit(form: NgForm) {
    this.userService.login(form.value).subscribe(
      res => {
        // tslint:disable-next-line: no-string-literal
        this.userService.setToken(res['token']);
        this.router.navigateByUrl('/event');
      },
      err => {
        // this.serverErrorMessages = err.error.message;
        console.log(err);
      }
    );
  }

}
