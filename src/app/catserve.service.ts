import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICat } from './cat';
import { GlobalConstants } from './globalvar/global';
@Injectable({
  providedIn: 'root'
})
export class CatserveService {
  url=GlobalConstants.apiURL+'/api/admin/categorycreate';
  //url='http://ec2-65-1-39-181.ap-south-1.compute.amazonaws.com/testlrvlaws/api/admin/categorycreate';
    constructor(private http:HttpClient) { }
    getData(nm:ICat){
      return this.http.post(this.url,nm);
    }
}
