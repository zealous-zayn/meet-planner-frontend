import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrManager,
  ) { }

  public email : string;
  ngOnInit() {
  }

  public resetPassword(){
    if(!this.email){
      
      this.toastr.warningToastr("Please provide registered email address", "Warning!");
    } else {
      
      this.appService.forgetPassword(this.email).subscribe(
        (response)=>{
          
          if(response['status'] === 200){
            this.toastr.successToastr(response.message);
          } else {
            this.toastr.errorToastr(response.messsage)
          }
        },
        (error)=>{
          this.router.navigate(['/serverError'])
        }
      )
    }
  }
  
}

