import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } from '../_services/user.service';
import { UserDetails } from '../_models/user-details';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  userDetail: UserDetails[]  = [];

  model = {
    email: '',
    password: ''
  };
  successMessage: any;
  serverErrorMessages: string;
  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/profile');
    }
  }
  onSubmit(form: NgForm) {
    this.userService.login(form.value).subscribe(
      res => {
        this.successMessage = res.message;
        this.userService.setToken(res.token);
        this.userService.setUser(res.user._id);
        this.router.navigateByUrl('/event');
        this.userDetail = res.user;
        console.log(this.userDetail);
        alert(this.successMessage);
      },
      err => {
         this.serverErrorMessages = err.error.message;
         console.log(err);
      }
    );
  }
}
