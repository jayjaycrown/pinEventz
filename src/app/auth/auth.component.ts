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
  successMessage: string;
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
        this.userDetail = res.user;
        console.log(this.userDetail);
        alert(this.successMessage);
        this.router.navigateByUrl('/event');
      },
      err => {
         this.serverErrorMessages = err.error.message;
         alert(this.serverErrorMessages);
         console.log(err);
      }
    );
  }
}
