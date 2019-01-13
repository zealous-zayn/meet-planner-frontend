import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  public userId: string;
  public message: string;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrManager
  ) { }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get('userId');

    this.appService.verifyEmail(this.userId).subscribe((apiResponse) => {

      if (apiResponse.status == 200) {
        this.toastr.successToastr(apiResponse['message']);
        this.message = "Your account has been Successfully activated. Please Log-In to enjoy our services"
      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");

      }
    },
      (error) => {
          this.router.navigate(['/serverError']);
      });//end calling verifyEmail
  }
  
}
