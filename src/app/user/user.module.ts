import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';



import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
              {path: 'login', component: LoginComponent, pathMatch:'full'},
              {path:"", redirectTo:'login', pathMatch:'full'},
              {path: 'signup', component: SignupComponent},
              {path:'forget-password', component:ForgetPasswordComponent},
              {path :'verify-email/:userId', component:VerifyEmailComponent},
              {path :'reset-password/:userId', component:ResetPasswordComponent}
];

@NgModule({
  declarations: [LoginComponent, 
                SignupComponent,
                ForgetPasswordComponent, 
                ResetPasswordComponent, 
                VerifyEmailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
