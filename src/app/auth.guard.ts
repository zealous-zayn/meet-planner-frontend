import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {AppService} from './app.service';
import {Router} from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private appService: AppService,
    private router: Router,
    private toastr: ToastrManager,
    ){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.appService.isLoggedIn() !== null){
        return true;
      }else{
        this.toastr.errorToastr('Please Login to access this page')
        setTimeout(()=>{
          this.router.navigate(["/login"]);
          return false;
        },2000);
        
      }
  }
}
