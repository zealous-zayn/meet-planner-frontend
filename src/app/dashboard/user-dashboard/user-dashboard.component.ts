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
import { AppService } from './../../app.service'
import { SocketService } from './../../socket.service'
import { ToastrManager } from 'ng6-toastr-notifications';

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
  },
  green: {
    primary: '#008000',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-user-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalAlert') modalAlert: TemplateRef<any>;


  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public userName: String
  public events: CalendarEvent[] = []
  public meetings = []
  public userInfo: any
  public intervalId: any
  public modalData: {
    action: string;
    event: CalendarEvent;

  };



  public activeDayIsOpen: boolean = false;
  public refresh: Subject<any> = new Subject();

  constructor(public socketService: SocketService, private toastr: ToastrManager, private modal: NgbModal, private cookieService: CookieService, public appService: AppService, public router: Router, ) { }

  ngOnInit() {
    this.userName = this.cookieService.get('UserName')
    this.userInfo = this.appService.getUserInformationstorage()
    if (this.userInfo.userDetails.isAdmin === false) {
      this.getAllMeeting()
      setTimeout(() => {
        this.meetingReminder();
      }, 2000)
      this.socketService.getUpdatesFromUser(this.cookieService.get('userId')).subscribe((data) => {
        this.toastr.infoToastr(data.message);
        this.getAllMeeting()
        setTimeout(() => {
          this.meetingReminder();
        }, 1000)
      });
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

  public eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  public logOut = () => {
    this.appService.logout()
      .subscribe(() => {
        this.cookieService.delete('authtoken')
        this.cookieService.delete('userId')
        this.cookieService.delete('UserName')
        localStorage.clear();
        this.socketService.exitSocket();
        this.router.navigate(['/'])
      })
  }

  public getAllMeeting() {
    this.appService.getAllMeets(this.cookieService.get('userId')).subscribe(
      (response) => {
        if (response.data !== null) {
          this.meetings = response.data;
          for (let meetingEvent of this.meetings) {
            meetingEvent.title = meetingEvent.title;
            meetingEvent.start = new Date(meetingEvent.startDate);
            meetingEvent.end = new Date(meetingEvent.endDate);
            meetingEvent.color = colors.green;
          }
          this.events = this.meetings;
          this.refresh.next();
        }
      }
    )
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

}
