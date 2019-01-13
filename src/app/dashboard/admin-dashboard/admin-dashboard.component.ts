import { Component, OnInit, ViewChild, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from './../../socket.service'

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalAlert') modalAlert: TemplateRef<any>;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public userName: String
  public _opened: boolean = false;
  public allUsers = []
  public selectedUserName: String
  public selectedUserId: String
  public events: CalendarEvent[] = []
  public meetings: any = []
  public userInfo: any
  public intervalId: any
  public participantIds = []

  public activeDayIsOpen: boolean = false;
  public refresh: Subject<any> = new Subject();
  public modalData: {
    action: string;
    event: CalendarEvent;

  };

  public actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];


  constructor(public socketService: SocketService, private modal: NgbModal, private toastr: ToastrManager, private cookieService: CookieService, public appService: AppService, public router: Router, ) { }

  ngOnInit() {
    this.selectedUserId = this.cookieService.get('userId')
    this.userName = this.cookieService.get('UserName')
    this.selectedUserName = this.cookieService.get('UserName')
    this.userInfo = this.appService.getUserInformationstorage()
    if (this.userInfo.userDetails.isAdmin === true) {
      this.getAllUsers()
      this.getAllMeeting()
      setTimeout(() => {
        this.meetingReminder();
      }, 2000)
      this.verifyUserConfirmation()
    } else {
      this.router.navigate(['/user-dashboard'])
    }
  }
  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.cookieService.get('authtoken'));
      })
  }

  public notifyUpdatesToUser: any = (data) => {
    this.socketService.notifyUpdates(data);
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.view = CalendarView.Day
      }
    }
  }

  public _toggleSidebar() {
    this._opened = !this._opened;
  }

  public eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    if (action === "Edited") {
      this.router.navigate(['/meet-edit/' + event['meetId']])
    } else if (action === "Deleted") {
      this.appService.deleteMeet(event['meetId']).subscribe(
        (response) => {
          if (response.status === 200) {
            this.toastr.successToastr(response.message)
          } else {
            this.toastr.errorToastr(response.message)
          }
          let notifcationData = {
            message: `A Meetin has been cancelled by ${this.cookieService.get('UserName')}.`,
            userId: this.participantIds
          }
          this.notifyUpdatesToUser(notifcationData);
        }
      ),
        (error) => {
          this.router.navigate(['/serverError'])
        }
    }
    else {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  public getAllMeeting() {
    this.appService.getAllMeets(this.selectedUserId).subscribe(
      (response) => {
        if (response.data !== null) {
          this.meetings = response.data;
          for (let meetingEvent of this.meetings) {
            meetingEvent.title = meetingEvent.title;
            meetingEvent.start = new Date(meetingEvent.startDate);
            meetingEvent.end = new Date(meetingEvent.endDate);
            meetingEvent.color = colors.green;
            meetingEvent.actions = this.actions
            meetingEvent.participant.forEach(user => this.participantIds.push(user.userId))
          }
        }
        this.events = this.meetings;
        this.refresh.next();
      }
    )
  }


  public logOut = () => {
    this.appService.logout()
      .subscribe(() => {
        this.cookieService.delete('authtoken')
        this.cookieService.delete('userId')
        this.cookieService.delete('UserName')
        localStorage.clear()
        this.socketService.exitSocket();
        this.router.navigate(['/'])
      })
  }

  public meetingReminder(): any {
    for (let meetingEvent of this.meetings) {
      let time = new Date(meetingEvent.start).getTime() - new Date().getTime() - 60000
      if (time > 0) {
        setTimeout(() => {
          this.modal.open(this.modalAlert, { size: 'sm' });
        }, time)
      }
    }
  }

  public snooze() {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(() => {
      this.modal.open(this.modalAlert, { size: 'sm' });
    }, 5000)

  }

  public dismiss() {
    clearInterval(this.intervalId)
  }

  public getAllUsers() {
    let userId = this.cookieService.get('userId')
    this.appService.getAllUsers().subscribe(
      (response) => {
        this.allUsers = response.data
        this.allUsers.forEach(function (user, index, object) {
          if (user.userId === userId) {
            object.splice(index, 1)
          }
        })
      }
    )
  }

  public selectUser(userId) {
    this.allUsers.forEach(user => {
      if (user.userId === userId) {
        this.selectedUserName = user.firstName + ' ' + user.lastName
      }
    })
    this.getAllMeeting()
    this._toggleSidebar()
  }

}
