import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { BoardService } from '../../_services/board.service';
import { Board } from '../../_models/board.interface';

@Component({
  selector: 'app-board-modal',
  template: `
  <form #board = "ngForm" (ngSubmit) = "board.form.valid && onClickSubmit(board.value)" >
    <div class="modal-header">
      <h4 class="modal-title">Create Board</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="container">
        <div class="form-group row">
          <label for="name" class="col-sm-4 col-form-label">Board Name:  </label>
          <div class="col-sm-8">
          <input type="text" minlength="4" class="form-control" name="name" placeholder="Board Name"
          [(ngModel)]="model.name" #name="ngModel" [ngClass]="{ 'is-invalid': board.submitted && name.invalid }" required>
          </div>
          <div *ngIf="board.submitted && name.invalid && (name.dirty || name.touched)" class="alert alert-danger">
            <div *ngIf="name?.errors.required">
              Board Name is required.
            </div>
            <div *ngIf="name?.errors.minlength">
            Board Name must be at least 4 characters long.
            </div>
          </div>
        </div>
        <div class="form-group row ">
          <label class="col-sm-4 col-form-label " for="cover">Choose file</label>
          <div class="col-sm-8">
          <input type="file" class="form-control" name="cover" ngModel>
        </div>
        </div>
        <div class="form-group row">
            <label for="desc" class="col-sm-4 col-form-label">Board Description:  </label>
            <div class="col-sm-8">
                <textarea name="desc"  class="form-control" rows="3" ngModel></textarea>
            </div>
        </div>
        <div class="form-group row">
            <label for="cat" class="col-sm-4 col-form-label">Categories:  </label>
            <div class="col-sm-8">
                <select class="custom-select"  name="cat" ngModel>
                    <option value="sport">Sport</option>
                    <option value="music">Music</option>
                    <option value="social">Social</option>
                </select>
            </div>
        </div>
        <div class="form-group row">
          <label for="status" class="col-sm-4 col-form-label">Visibility:  </label>
          <div class="col-sm-8">
            <select class="custom-select" name="status" ngModel>
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

  board: Board[];
  postData: Board;
  headers: any;
  constructor(public activeModal: NgbActiveModal, private route: ActivatedRoute, private boardDet: BoardService) { }

  onClickSubmit(formData) {
    console.log(formData);
    this.activeModal.close();
    this.boardDet.addBoard(formData).subscribe(
      data => {
        console.log(data);
        return this.board.push(data);
      }
    );
  }

  ngOnInit() {
  }

}
