import { Injectable } from '@angular/core';
import { pub } from './pub';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from './globalvar/global';
@Injectable({
  providedIn: 'root'
})
export class PublisherRegistrationService {
  url=GlobalConstants.apiURL+'/api/publisher/register';
 //url='http://ec2-65-1-39-181.ap-south-1.compute.amazonaws.com/testlrvlaws/api/publisher/register';
  constructor(private http:HttpClient) { }
  registration(rpub:pub){
    return this.http.post(this.url,rpub);
  }
}
