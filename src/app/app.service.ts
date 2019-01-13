import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public baseUrl = 'http://localhost:3000/api/v1/users'

  constructor(private cookieService: CookieService, private _http: HttpClient) { }

  public getUserInformationstorage=()=>{
    return (JSON.parse(localStorage.getItem('userInfo')));
   }
 
   public setUserInformationStorage=(data)=>{
     localStorage.setItem('userInfo', JSON.stringify(data))
   }

   public isLoggedIn() {
    return(this.getUserInformationstorage())
  }

   public signinFunction(data): Observable<any>{
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password)

    return this._http.post(`${this.baseUrl}/login`, params)
  }
  
  public getCountryNames(): Observable<any> {

    return this._http.get("./../assets/countryName.json");

  }//end getCountryNames

  public getCountryCodes(): Observable<any> {

    return this._http.get("./../assets/countryCode.json");
    
  }//end getCountryNumbers

  public signUp(data): Observable<any>{

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('country',data.country)
      .set('isAdmin', data.isAdmin)

    return this._http.post(`${this.baseUrl}/signup`, params);
  }//end signUp 

  public verifyEmail(userId): Observable<any>{
    const params = new HttpParams()
      .set('userId', userId)

      return this._http.post(`${this.baseUrl}/verifyEmail`, params)
  }

  public forgetPassword(email): Observable<any>{
    const params = new HttpParams()
      .set('email', email)
      return this._http.post(`${this.baseUrl}/forgetPassword`, params)
  }

  public resetPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('password', data.password)
      return this._http.post(`${this.baseUrl}/resetPassword`, params)
  }

  public logout(): Observable<any> {
    
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))
      .set('userId', this.cookieService.get('userId'))

    return this._http.post(`${this.baseUrl}/logout`, params);

  }

  public getAllUsers(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))

     return this._http.get(`${this.baseUrl}/getAllUsers`, {params : params}) 
  }

  public createMeeting(data): Observable<any> {
    const params = new HttpParams()
    .set('authToken', this.cookieService.get('authtoken'))
    .set('title', data.title)
    .set('creatorId', data.creatorId)
    .set('creatorName', data.creatorName)
    .set('participant', JSON.stringify(data.participant))
    .set('startDate', data.startDate)
    .set('endDate', data.endDate)
    .set('description', data.description)
    .set('venue', data.venue)

    return this._http.post(`${this.baseUrl}/create-meet`, params)

  }

  public editMeeting(data): Observable<any> {
    const params = new HttpParams()
    .set('authToken', this.cookieService.get('authtoken'))
    .set('meetId', data.meetId)
    .set('title', data.title)
    .set('creatorId', data.creatorId)
    .set('creatorName', data.creatorName)
    .set('participant', JSON.stringify(data.participant))
    .set('startDate', data.startDate)
    .set('endDate', data.endDate)
    .set('description', data.description)
    .set('venue', data.venue)

    return this._http.post(`${this.baseUrl}/edit-meet`, params)

  }

  public getAllMeets(userId): Observable<any>{
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))

     return this._http.get(`${this.baseUrl}/get-all-meet/${userId}`, {params : params}) 
  }

  public deleteMeet(meetId): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))
      .set('meetId', meetId)

     return this._http.post(`${this.baseUrl}/delete-meet`, params) 
  }

  public getSingleMeet(meetId): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))

     return this._http.get(`${this.baseUrl}/get-single-meet/${meetId}`, {params: params}) 
  }
}
