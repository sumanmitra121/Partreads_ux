import { Component, ElementRef, OnInit ,ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/globalvar/global';
import { ShowcartService } from './showcart.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UtilityTService } from 'src/app/Utility/utility-t.service';
@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.css',
  '../../../assets/cssfiles/bootstrap.css',
  '../../../assets/cssfiles/font-awesome.css',
  '../../../assets/chosen/chosen.css',
  '../../../assets/cssfiles/apps.css',
  '../../../assets/cssfiles/res.css',
  '../../../assets/cssfiles/apps_inner.css']
})
export class CartpageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['Thumbnail', 'Book Name', 'ISBN Number', 'Pages','Full Book', 'Price', 'Buy'];
  dataSource = new MatTableDataSource([]);
  constructor(private utilyT:UtilityTService,private show1:ShowcartService,private show:ShowcartService,private router:Router) { }
  userdata1:any=[];
  b_id:any;
  loader = true;
  p_id:any;
  c=0;
  userdata11:any=[];
  modal_close:any;
  delete_id:any;
  url=GlobalConstants.apiURL;
  check_response:any='';
  _bk_name:any;
  ngOnInit(): void {
    localStorage.setItem('address','/user/cart')
     this.inddatasource();
  }
  public inddatasource(){
    this.userdata1.length=0;
    this.show.getcart(localStorage.getItem('u-id'), localStorage.getItem('user-type_user'), localStorage.getItem('remember_token')).pipe(map(x => JSON.parse(x))).subscribe(data=>{
      this.userdata1 = data.success > 0 ? data.message : [];
      this.loader = false;
      this.dataSource = new MatTableDataSource(this.userdata1);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;    
    })
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotobuy(v1:any,v2:any,book_name:any,frm:any,to:any,whole_book:any){

    // localStorage.setItem('book_Index',v2);
    // localStorage.setItem('Pub_id',v2);
    // localStorage.setItem('book_name',book_name);
    // localStorage.setItem('frm',frm);
    // localStorage.setItem('to',to);
    // localStorage.setItem('whole_book',whole_book);
    this.router.navigate(['/user/payment',v1,v2,book_name,frm,to,whole_book]);
    // localStorage.setItem('user_book_id',v1);
    // localStorage.setItem('user_pub_id',v2);
    // this.router.navigate(['/user/bookdetails']);
  }
  delbook(v1:any,v2:any,v3:any,_bk_name:any){
    this.b_id=v1;
    this.p_id=v2;
    this.delete_id=v3;
    this._bk_name = _bk_name;
  }
  del(){
    this.loader=true;
    this.show.removeCart(localStorage.getItem('u-id'), localStorage.getItem('user-type_user'), localStorage.getItem('remember_token'),this.delete_id).subscribe(data=>{
      this.check_response=JSON.parse(data);
      this.modal_close=document.getElementById('Cancel');
      this.modal_close.click();
      if(this.check_response.success > 0){
        this.inddatasource();
        this.getcartvalue()
        this.loader=false;
        this.utilyT.showToastr('Removal of cart Successful!','S');
      }
      else{
          this.loader=false;
          this.utilyT.showToastr('Removal of cart failed!','E');
      }
    },error=>{
      this.loader=false;
      this.utilyT.showToastr('Server did not respond!','E');
    })
  }
  getcartvalue(){
    this.utilyT.getcartvalue().then((res) =>{
      this.c = Number(res);
    })
    // this.show1.getcart(localStorage.getItem('u-id'), localStorage.getItem('user-type_user'), localStorage.getItem('remember_token')).subscribe(data=>{this.userdata11=JSON.parse(data);
    //   if(this.userdata11.success=='1')
    //   this.c=this.userdata11.message.length;
    //   else
    //   this.c=0;
    // })
    
  }
}
