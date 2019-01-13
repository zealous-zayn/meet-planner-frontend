import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import {AppService} from './../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from './../socket.service'

@Component({
  selector: 'app-meet-edit',
  templateUrl: './meet-edit.component.html',
  styleUrls: ['./meet-edit.component.css']
})
export class MeetEditComponent implements OnInit {
  public meetId : String
  public eventTitle : String
  public venue: String
  public description: String;
  public startTime: Date
  public endTime: Date
  public allUsers: any = []
  public participants = []
  public dropdownSettings = {};
  public singleMeetDetails : any
  public participantIds = []

  constructor(public socketService: SocketService,private _route:ActivatedRoute, private cookieService: CookieService, public appService: AppService, public router: Router, private toastr : ToastrManager ) { }

  ngOnInit() {
    this.meetId = this._route.snapshot.paramMap.get('meetId')
    this.getAllUsers();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'userId',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 'All',
      allowSearchFilter: true
    };
    this.singleMeet()
    this.verifyUserConfirmation()
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


  public getAllUsers(){
    let userId = this.cookieService.get('userId')
    this.appService.getAllUsers().subscribe(
      (response)=>{
        this.allUsers = response.data
        this.allUsers.forEach(function (user, index, object) {
          if (user.userId === userId) {
            object.splice(index, 1)
          }
        })
      }
    ),
    (error)=>{
      console.log(error)
      setTimeout(()=>{
      this.router.navigate(['/serverError'])
      }, 2000)
    }
  }

  public singleMeet(){
    this.appService.getSingleMeet(this.meetId).subscribe(
      (response)=>{
        if(response.status === 200){
            this.eventTitle = response.data.title
            this.venue = response.data.venue
            this.description = response.data.description
            this.startTime = new Date(response.data.startDate)
            this.endTime = new Date(response.data.endDate)
            this.participants = response.data.participant
            
        } else {
          this.toastr.errorToastr(response.message)
        }
      }
    ), 
    (error)=>{
      this.router.navigate(['/serverError'])
    }
  }
  

  public editMeet(){
    if (!this.eventTitle) {
      this.toastr.warningToastr("Title is required", "Warning!");
    }
    else if (!this.description) {
      this.toastr.warningToastr("Description is required", "Warning!");
    }
    else if (!this.participants) {
      this.toastr.warningToastr("Participant is required", "Warning!");
    }
    else if (!this.startTime) {
      this.toastr.warningToastr("Start Date/Time is required", "Warning!");
    }
    else if (!this.endTime) {
      this.toastr.warningToastr("End Date/Time is required", "Warning!");
    }
    else if (!this.venue) {
      this.toastr.warningToastr("Venue is required", "Warning!");
    } else {
          let data = {
            meetId : this.meetId,
            title : this.eventTitle,
            creatorId: this.cookieService.get('userId'),
            creatorName: this.cookieService.get('UserName'),
            venue : this.venue,
            description: this.description,
            startDate : this.startTime.getTime(),
            endDate : this.endTime.getTime(),
          }
          data['participant'] = this.participants,
          console.log(data)
          this.appService.editMeeting(data).subscribe(
            (response)=>{
              if(response.status === 200){
                this.toastr.successToastr(`Meeting has been Schedule with  Successfully`)
                setTimeout(()=>{
                  this.router.navigate(['/admin-dashboard'])
                },2000)
              } else {
                this.toastr.errorToastr(`Failed to Schedule Meeting with  Successfully`)
              }
            }
          ),
          (error)=>{
            this.router.navigate(['/serverError'])
          }
          this.participants.forEach(user => this.participantIds.push(user.userId))
              let notifcationData = {
                message: `A Meeting has been Updated by ${this.cookieService.get('UserName')}.`,
                userId: this.participantIds
              }
              this.notifyUpdatesToUser(notifcationData);
  }
  }

}  
