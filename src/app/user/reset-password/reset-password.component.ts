import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public password: string;
  public confirmPassword: string;
  public userId: string;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrManager
  ) { }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get('userId');
  }

  public resetPassword = () => {
    if(!this.password){
      this.toastr.warningToastr('Please enter password')
    }else{
    let data = {
      userId : this.userId,
      password : this.password
    }

    this.appService.resetPassword(data).subscribe(
      (response)=>{
        if(response.status === 200){
          this.toastr.successToastr(response.message)
          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 2000);//redirecting to signIn page
        } else {
          this.toastr.errorToastr(response.message)
        }
      },
      (error)=>{
        this.router.navigate(['/serverError'])
      }
    )
  }
  }

}
