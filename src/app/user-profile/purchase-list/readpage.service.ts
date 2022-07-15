import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from 'src/app/globalvar/global';
import { catchError, retry, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReadpageService {
  url=GlobalConstants.apiURL+'/api/user/purchasebookpageshow1new';
  // url=GlobalConstants.apiURL+'/api/user/purchasebookpageshow1';
  constructor(private http:HttpClient) { }
  readpages(book_id:any,publisher_id:any,id:any,type:any,remembertoken:any,_total_page:any){
    const formdata=new FormData();
    formdata.append('book_id',book_id);
    formdata.append('publisher_id',publisher_id);
    formdata.append('id',id);
    formdata.append('user_type',type);
    formdata.append('remember_token',remembertoken);
    formdata.append('total_page_no',_total_page);
    // let headers = new HttpHeaders().set('Range', 'bytes=0-123').set('Access-Control-Allow-Origin','*');
    return this.http.post(this.url,formdata,{responseType:'text'});
  }
  
}
