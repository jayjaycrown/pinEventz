import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';


import { UserService } from '../_services/user.service';
import { UserDetails } from '../_models/user-details';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, public loader: LoadingBarService) { }
  userDetails: UserDetails[];
// tslint:disable-next-line: max-line-length
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  // tslint:disable-next-line: variable-name
   model: UserDetails = {
    _id: '',
    email: '',
    fullName: '',
    password: '',
    cityCountry: '',
    dateOfBirth: '',
    gender: '',
    confirmPassword: '',
    eventUrl: ''
    // checkbox: '',
  };




  onSubmit(form: NgForm) {
    this.loader.start(10);
    // console.log(form.value);
    this.userService.register(form.value).subscribe(
      res => {
        // console.log(res);
        this.showSucessMessage = true;
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 3000);
        this.loader.stop();
      },
      err => {
        if (err.error.msg) {
          this.serverErrorMessages = err.error.msg[0].message;
          this.loader.stop();
        }
        if (err.error.message) {
          this.serverErrorMessages = err.error.message;
          this.loader.stop();
        }
        console.log(err);
        alert(err);
        this.loader.stop();
      }
    );
  }
  ngOnInit() {
  }

}
