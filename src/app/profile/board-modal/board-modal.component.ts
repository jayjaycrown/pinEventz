import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgxSpinnerService } from 'ngx-spinner';



import { BoardService } from '../../_services/board.service';
import { Board } from '../../_models/board.interface';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-board-modal',
  templateUrl: './board-modal.component.html',
  styles: []
})
export class BoardModalComponent implements OnInit {
  preview: string;
  form: FormGroup;
  percentDone: any = 0;

  postData: Board;
  headers: any;
  constructor(public activeModal: NgbActiveModal,
              public fileUploadService: BoardService,
              public fb: FormBuilder,
              public router: Router,
              public loader: LoadingBarService,
              private Spinner: NgxSpinnerService) {
                // Reactive Form
                this.form = this.fb.group({
                  boardName: [''],
                  boardStatus: [''],
                  boardUrl: [null],
                  boardCategory: [''],
                  boardDescription: ['']
                });
               }

  onClickSubmit() {
    this.Spinner.show();
    this.loader.start(10);
    // console.log(this.form.value);
    this.fileUploadService.addBoard(
      this.form.value.boardName,
      this.form.value.boardDescription,
      this.form.value.boardCategory,
      this.form.value.boardStatus,
      this.form.value.boardUrl,
    ).subscribe((event: HttpEvent<any>) => {
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
          // alert(event.body.message);
          console.log('Board successfully created!', event.body);
          this.percentDone = false;
          this.Spinner.hide();
          this.activeModal.close();
      }
      this.loader.stop();
      this.Spinner.hide();
    });
  }

  ngOnInit() {
  }
  // Image Preview
  uploadFile(event: { target: HTMLInputElement; }) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      boardUrl: file
    });

}

}
