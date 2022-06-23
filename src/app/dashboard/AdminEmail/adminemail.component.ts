import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityTService } from 'src/app/Utility/utility-t.service';
import { Publishers } from 'src/app/Utility/__publisher';
@Component({
  selector: 'app-table',
  templateUrl: './adminemail.component.html',
  styleUrls: ['./adminemail.component.css',
  "../../../assets/adminassets/css/font-awesome.css",
  "../../../assets/adminassets/css/apps.css",
  "../../../assets/adminassets/css/apps_inner.css",
  "../../../assets/adminassets/css/res.css"]
})
export class adminemailComponent implements OnInit {
  _userType:any=[];
  _sentEmail!:FormGroup;
  publishers:Publishers[]=[];
  backUppublishers:Publishers[]=[];
  constructor(private fb:FormBuilder,private utilyT:UtilityTService) { 
    this._sentEmail = this.fb.group({
      _bodyText:['',Validators.required],
      _user_type:['',Validators.required],
      _flag:['U',Validators.required],
      _publishers:['',Validators.required],
      _searchPublishers:[''],  
    }) 
  }
  get f(){return this._sentEmail.controls;}
  ngOnInit(): void {this.getPublishers();this.getUserType();}
  ngAfterViewInit(){
  }
  SendEmail(){
    var dt ={
      "user_type":this.f._flag.value  == 'U' ? this.f._user_type.value : '',
      "publisher":this.f._flag.value  == 'P' ?  this.f._publishers.value : [],
      "admin_id" : localStorage.getItem('token'),
      "email_body":this.f._bodyText.value,
      "flag":this.f._flag.value
    }
    this.utilyT.submitEmail('api/admin/SentEmail',dt);
    this._sentEmail.reset();
  }
  selAll(_event:any){
    this._sentEmail.patchValue({_publishers: _event.checked ? this.publishers :[]})         
  }
  getPublishers(){
     this.utilyT.getPublishers().then(publisher => {
        this.publishers = publisher.filter((x:Publishers) => x.user_status == 'A');    
        this.backUppublishers = this.publishers;  
    })
  }
  getUserType(){
    this.utilyT.getuserType().then(res => {
      this._userType = res;
   });
  }

}
