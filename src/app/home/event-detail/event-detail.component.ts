import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';

import { GeocodeService } from '../../_services/geocode.service';
import { Location } from '../../_models/location';


import { EventDetailService } from '../../_services/event-detail.service';
import { EventDetails } from '../../_models/event-details';
import { UserService } from 'src/app/_services/user.service';
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { BoardService } from 'src/app/_services/board.service';
import { BoardModalComponent } from 'src/app/profile/board-modal/board-modal.component';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})

export class EventDetailComponent implements OnInit {
  form: any;
  boards: any;
  percentDone: any = 0;
  successMessage: any;
  closeResult: string;
  modalReference: NgbModalRef<any>;
  activeModal: NgbActiveModal;
  loading: boolean;
  address = '';
  location: Location;
  reverse = true;
  events: EventDetails[];
  organizer: any;
  user: any;

  id = this.route.snapshot.paramMap.get('eventId');
  comments: any;
  showEdit = false;
  model = {
    text: ''
  };
  boardModel = {
    boardId: ''
  };
  constructor(
              private geocodeService: GeocodeService,
              private ref: ChangeDetectorRef,
              public config: NgbModalConfig,
              public router: Router,
              public boardService: BoardService,
              private route: ActivatedRoute,
              private evDet: EventDetailService,
              private modalService: NgbModal,
              public userService: UserService,
              public orderPipe: OrderPipe,
              public fb: FormBuilder) {
                config.backdrop = 'static';
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

  activeModals() {
    return this.activeModal.close();
  }
  open(content: any) {
    this.activeModal = this.modalService.open(content, {scrollable: true});
  }
  map(OpenMap: any) {
    this.activeModal = this.modalService.open(OpenMap);
  }
  editEvent(edit: any) {
    this.activeModal = this.modalService.open(edit, { size: 'lg'});
  }
  pinEvent(pin: any) {
    this.activeModal = this.modalService.open(pin);
  }
  join(register: any) {
    this.activeModal = this.modalService.open(register);
  }
  onSubmit(form: NgForm) {
    this.model.text = '';
    this.evDet.postComment(form.value, this.id).subscribe();
  }
  submitPin(pinEvent: NgForm) {
    this.evDet.pinEvent(pinEvent.value, this.id).subscribe(
     res => {
      alert(res.message);
      this.activeModal.close();
     },
     err => {
       alert(err);
       this.activeModal.close();
     }
    );
  }

  onClickSubmit() {
    // console.log(this.id);
    this.evDet.updateEvent(
      this.id,
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
          console.log('Board successfully edited!', event.body);
          this.percentDone = false;
          this.activeModal.close();
      }
    });
  }


  getConfirmation(id: any) {
    const retVal = confirm('Are you sure you really want to delete this Event?');
    if ( retVal === true ) {
      return this.delete(id);
    } else {
       return false;
    }
 }

  delete(id: any) {
    console.log('deleting......');
    this.evDet.deleteEvent(id).subscribe(data => {
      this.router.navigate(['event']);
      return this.events.push(data);

    });
  }

  // updateEvent(id: any) {
  //   this.evDet
  //     .updateEvent(id, this.postdata)
  //     .subscribe(resp => {
  //       return this.spresp.push(resp);
  //     });
  // }
  getUser() {
    this.user = localStorage.getItem('user');
    // console.log('UserId is: ' + this.user);
    return this.user;
}

getEventById() {
  this.loading = true;
  this.route.paramMap.subscribe(
    paramMap => {
      this.evDet.getEventById(paramMap.get('eventId')).subscribe(data => {
        console.log(data);
        this.events = data;
        this.comments = data.comments;
        this.address = data.address;
        console.log(this.address);
        this.geocodeService.geocodeAddress(this.address)
        .subscribe((location: Location) => {
          this.location = location;
          console.log(this.location);
        }
        );



        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.comments.length; i++) {
          const element = this.comments[i].authorId;
          // console.log(element);
        }

        this.organizer = data.organizer;
        // console.log( 'Organizer Id' + this.organizer[0].id);
        // console.log('User Id' + this.user);
        if (this.organizer[0].id ===  this.user) {
          this.showEdit = !this.showEdit;
        }
        // console.log(this.showEdit);
      });
    }
  );
}

openBoardModal() {

  this.modalService.open(BoardModalComponent);
}

getBoard() {
  this.boardService.getBoard().subscribe( res => {
    this.boards = res;
    // console.log(res);
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
    // this.showLocations();
    this.evDet.refreshNeded$.subscribe(() => {
      this.getEventById();
    });
    this.getEventById();
    this.getUser();
    this.getBoard();


  }
  // showLocations() {
  //   this.addressToCoordinates();
  // }
  // addressToCoordinates() {
  //   this.loading = true;
  //   this.geocodeService.geocodeAddress(this.address)
  //     .subscribe((location: Location) => {
  //       this.location = location;
  //     }
  //     );
  // }


  //   if (this.id != null) {
  //    console.log('id: ' + this.id);
  //  }

}
