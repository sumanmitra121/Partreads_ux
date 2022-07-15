import { Injectable } from '@angular/core';
import { publog } from './publog';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from './globalvar/global';

@Injectable({
  providedIn: 'root'
})
export class PublisherLoginService {
 url=GlobalConstants.apiURL+'/api/publisher/login';
  //url='http://ec2-65-1-39-181.ap-south-1.compute.amazonaws.com/testlrvlaws/api/publisher/login';
  constructor(private http:HttpClient) {}
   login_pub(pub:publog){
      return this.http.post(this.url,pub)
      
  }
}
