import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { BoardModalComponent } from '../../profile/board-modal/board-modal.component';
import { EventDetailService } from '../../_services/event-detail.service';
import { BoardService } from '../../_services/board.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.css']
})
export class CreateEventModalComponent implements OnInit {
  boards: any;
  form: FormGroup;
  percentDone: any = 0;
  headers: any;

  constructor(
    public activeModal: NgbActiveModal,
    public boardService: BoardService,
    public eventService: EventDetailService,
    public fb: FormBuilder,
    public modalService: NgbModal,
  ) {
    this.form = this.fb.group({
      eventName: ['',  Validators.required],
      address: ['',  Validators.required],
      shortDes: ['',  Validators.required],
      fullDes: ['',  Validators.required],
      eventUrl: [null],
      startDate: ['',  Validators.required],
      finishDate: ['',  Validators.required],
      board: ['',  Validators.required],
      status: ['',  Validators.required],
      category: ['',  Validators.required],
      time: ['',  Validators.required],

    });
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
  uploadUrl: 'v1/image',
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    ['bold', 'italic'],
    ['fontSize']
  ]
  };

  onClickSubmit() {
    console.log(this.form.value);
    this.eventService.addEvent(
      this.form.value.eventName,
      this.form.value.address,
      this.form.value.shortDes,
      this.form.value.fullDes,
      this.form.value.eventUrl,
      this.form.value.startDate,
      this.form.value.finishDate,
      this.form.value.board,
      this.form.value.status,
      this.form.value.category,
      this.form.value.time,
)
.subscribe((event: HttpEvent<any>) => {
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
          alert(event.body.message);
          console.log('event successfully created!', event.body);
          this.percentDone = false;
          this.activeModal.close();
      }
    });
  }

  openBoardModal() {

    this.modalService.open(BoardModalComponent);
  }

  getBoard() {
    this.boardService.getBoard().subscribe( res => {
      this.boards = res;
      console.log(res);
    });
  }
   // Image Preview
   uploadFile(event: { target: HTMLInputElement; }) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      eventUrl: file
    });

}
    ngOnInit() {
    this.getBoard();
  }


}
