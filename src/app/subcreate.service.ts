import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IsubCat } from './subcats';
import { GlobalConstants } from './globalvar/global';

@Injectable({
  providedIn: 'root'
})
export class SubcreateService {
 url=GlobalConstants.apiURL+'/api/admin/subcategorycreate';
  //url="http://ec2-65-1-39-181.ap-south-1.compute.amazonaws.com/testlrvlaws/api/admin/subcategorycreate";
  constructor(private http:HttpClient) { }
  putdata(nm:IsubCat){
    return this.http.post(this.url,nm);
  }
}
