import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CookieService} from 'ngx-cookie-service';
import { AppService} from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
     private cookieService : CookieService,
     private toastr : ToastrManager,
     public appService : AppService,
     public router: Router) { }

  ngOnInit() {
  }

  public signinFunction(): any {
    if (!this.email){
      this.toastr.warningToastr('Please Enter Email','Alert',{toastTimeout:2000})
    } else if (!this.password){
      this.toastr.warningToastr('Please Enter Password','Alert',{toastTimeout:2000})
    } else {
      let data = {
        email: this.email,
        password: this.password
      }
      this.appService.signinFunction(data)
      .subscribe(
        (apiResponse)=>{
        if(apiResponse.status===200){
          console.log(apiResponse.data)
          this.cookieService.set('authtoken', apiResponse.data.authToken);
          this.cookieService.set('userId', apiResponse.data.userDetails.userId);
          this.cookieService.set('UserName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          this.appService.setUserInformationStorage(apiResponse.data)
          if(apiResponse.data.userDetails.isAdmin === true){
          this.router.navigate(['/admin-dashboard'])
        }else{
          this.router.navigate(['/user-dashboard'])
        }
        } else{
          this.toastr.successToastr(apiResponse.message,'Welcome',{toastTimeout:2000})
        }
      },
      (error)=>{
        this.router.navigate(['/serverError']);
      }
      
      )
    }
  }

}

