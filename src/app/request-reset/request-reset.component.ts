import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {UserService} from '../_services/user.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
})
export class RequestResetComponent implements OnInit {
  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(
    private authService: UserService,
    private router: Router,
   ) {

  }


  ngOnInit() {

    this.RequestResetForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }


  RequestResetUser(form) {
    console.log(form);
    if (form.valid) {
      this.IsvalidForm = true;
      this.authService.requestReset(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.successMessage = 'Reset password link send to email sucessfully.';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['sign-in']);
          }, 3000);
        },
        err => {

          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }
}
