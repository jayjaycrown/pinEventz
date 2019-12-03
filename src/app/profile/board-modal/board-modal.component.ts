import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

import { BoardService } from '../../_services/board.service';
import { Board } from '../../_models/board.interface';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-board-modal',
  template: `
  <form [formGroup]="form" (ngSubmit) = "onClickSubmit()" >
    <div class="modal-header">
      <h4 class="modal-title">Create Board</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="container">
      <!-- Progress Bar -->
      <!-- Image Preview -->
      <div class="form-group">
        <div class="preview" *ngIf="preview && preview !== null">
          <img [src]="preview" [alt]="form.value.name">
        </div>
      </div>
        <div class="form-group row">
          <label for="name" class="col-sm-4 col-form-label">Board Name:  </label>
          <div class="col-sm-8">
          <input type="text" minlength="4" class="form-control" name="boardName" placeholder="Board Name"
          required formControlName="boardName">
          </div>
        </div>
        <!-- File Input -->
      <div class="form-group row">
        <label class="col-sm-4 col-form-label " for="cover">Choose file</label>
        <input type="file" (change)="uploadFile($event)">
      </div>

        <div class="form-group row">
            <label for="desc" class="col-sm-4 col-form-label">Board Description:  </label>
            <div class="col-sm-8">
                <textarea name="boardDescription"  formControlName="boardDescription" class="form-control" rows="3" ></textarea>
            </div>
        </div>
        <div class="form-group row">
            <label for="cat" class="col-sm-4 col-form-label" >Categories:  </label>
            <div class="col-sm-8">
                <select class="custom-select"  name="boardCategory" formControlName="boardCategory">
                    <option value="sport">Sport</option>
                    <option value="music">Music</option>
                    <option value="social">Social</option>
                </select>
            </div>
        </div>
        <div class="form-group row">
          <label for="status" class="col-sm-4 col-form-label">Visibility:  </label>
          <div class="col-sm-8">
            <select class="custom-select" name="boardStatus"  formControlName="boardStatus">
                <option value="private">Private</option>
                <option value="public">Public</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
    <input type="submit" class="btn btn-primary btn-sm" value="Create Board">
      <button type="button" class="btn btn-outline-dark btn-sm" (click)="activeModal.close('Close click')">Close</button>
    </div>
</form>
  `,
  styles: []
})
export class BoardModalComponent implements OnInit {
  model: any = {};
  preview: string;
  form: FormGroup;
  percentDone: any = 0;

  board: Board[];
  postData: Board;
  headers: any;
  constructor(public activeModal: NgbActiveModal,
              private route: ActivatedRoute,
              public fileUploadService: BoardService,
              public fb: FormBuilder,
              public router: Router) {
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
    this.activeModal.close();
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
          console.log(`Uploaded! ${this.percentDone}%`);
          break;
        case HttpEventType.Response:
          console.log('Board successfully created!', event.body);
          this.percentDone = false;
      }
    });
  }

  ngOnInit() {
  }
  // Image Preview
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      boardUrl: file
    });

}}
