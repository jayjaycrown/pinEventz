import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

import { MustMatch } from '../../_helpers/must-match.validator';


import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: any;
  form: FormGroup;
  percentDone: any = 0;
  headers: any;
  successMessage: any;
  serverErrorMessages: any;

  constructor( public userService: UserService, public fb: FormBuilder, public router: Router,  public loader: LoadingBarService) {
    this.form = this.fb.group({
      email: [''],
      fullName: [''],
      cityCountry: [''],
      dateOfBirth: [''],
      gender: [''],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      profileUrl: [null]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });
}
get f() { return this.form.controls; }


  onClickSubmit() {
    this.loader.start(10);
    // console.log(this.form.value);
    this.userService.editProfile(
      this.form.value.email,
      this.form.value.fullName,
      this.form.value.cityCountry,
      this.form.value.dateOfBirth,
      this.form.value.gender,
      this.form.value.password,
      this.form.value.profileUrl,
    ).subscribe(
      (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.percentDone = Math.round(event.loaded / event.total * 100);
          // console.log(`Uploaded! ${this.percentDone}%`);
          break;
        case HttpEventType.Response:
          alert(event.body.message);
          console.log('Profile successfully Updated!', event.body);
          this.percentDone = false;
          this.loader.stop();
          this.router.navigateByUrl('/profile');
      }
    });
  }

  getUser() {
    this.userService.profile().subscribe(res => {
      // tslint:disable-next-line: no-string-literal
      this.user = res['user'];
    }, (err) => {
      console.error(err);
    });
  }

  ngOnInit() {
    this.getUser();
  }
      // Image Preview
    uploadFile(event: { target: HTMLInputElement; }) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({
        profileUrl: file
      });

  }
}
