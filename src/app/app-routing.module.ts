import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{AuthGuard} from './auth.guard';
import { FormsModule } from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';





import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { MeetCreateComponent } from './meet-create/meet-create.component';
import { MeetEditComponent } from './meet-edit/meet-edit.component'

const routes: Routes = [
  {path: 'meet-create', component: MeetCreateComponent, canActivate: [AuthGuard]},
  {path: 'meet-edit/:meetId', component: MeetEditComponent, canActivate: [AuthGuard]},
  {path: 'serverError', component: ServerErrorComponent},
  {path:'*', component:PageNotFoundComponent},
  {path:'**', component:PageNotFoundComponent}
];

@NgModule({
  declarations: [
    PageNotFoundComponent,
    ServerErrorComponent,
    MeetCreateComponent,
    MeetEditComponent
  ],  
  imports: [FormsModule, 
            BrowserModule,
            OwlDateTimeModule, 
            OwlNativeDateTimeModule,
            BrowserAnimationsModule,
            NgMultiSelectDropDownModule.forRoot(),
            RouterModule.forRoot(routes),
          ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
