import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from './globalvar/global';
@Injectable({
  providedIn: 'root'
})
export class ApprovebookService {
url=GlobalConstants.apiURL+'/api/admin/approvedbook';
  //url="http://ec2-65-1-39-181.ap-south-1.compute.amazonaws.com/testlrvlaws/api/admin/approvedbook";
  constructor(private http:HttpClient) { }
  approvebooks(v1:any,v2:any){
    const formdata=new FormData()
    formdata.append('id',v1);
    formdata.append('show_book',v2);
    return this.http.post(this.url,formdata,{responseType:'text'})
  }
}
