import { Component, OnInit } from '@angular/core';
import { BooklistService } from 'src/app/booklist.service';
import { pubid } from '..//..//pubid';
import { activebook } from '..//..//activatebook';
import { ActivateService } from 'src/app/activate.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/user-profile/alert-dialog/alert-dialog.component';
import { map } from 'rxjs/operators';
//import * as $ from 'jquery';
declare const showprofile: any;
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css',
    '../../../assets/cssfiles/bootstrap.css',
    '../../../assets/cssfiles/font-awesome.css',
    '../../../assets/chosen/chosen.css',
    '../../../assets/cssfiles/apps.css',
    '../../../assets/cssfiles/res.css',
    '../../../assets/cssfiles/apps_inner.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BookListComponent implements OnInit {
  _modal_body:any;
  pdf_loader:boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog,private toastr:ToastrManager,private booklistshow: BooklistService, private actv: ActivateService, private router: Router, private cookieService: CookieService) { }
  p: any;
  book_name: any;
  category: any = [];
  a: any;
  tick_cross: boolean = true;
  link: any;
  bk_name: any;
  alert_div: any;
  alert_show = true;
  loader = true;
  errormessage:any;
  substring:any='';
  value1:any;
  value2:any;

  displayedColumns: string[] = ['Thumbnail', 'Admin Review', 'Book Name','Price', 'Status','Action'];
  dataSource = new MatTableDataSource([]);

   public inddatasource(){
     console.log(this.category);
    this.dataSource = new MatTableDataSource(this.category);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
 }
  ngOnInit(): void {
      this.show_it();
      localStorage.setItem('address','/publisher/book-list');
  }
  close_alert() {
    this.alert_div = document.getElementById('uploaded');
    this.alert_div.style.display = 'none';
  }
  showbookname(v1: any, v2: any,_flag:any) {
    this.pdf_loader=true;
     this._modal_body = _flag;
    this.bk_name = v1;
    this.link = v2;
    this.pdf_loader = false;
  }
  activation(v1:any,v2:any,_flag:any){
     this.value1=v1;
     this.value2=v2;
     this._modal_body = _flag;
}
  activation1() {
      this.a = new activebook(this.value1,this.value2);
      this.actv.activate(this.a).pipe(map(x => JSON.parse(x)),map(x=> x.message)).subscribe(data => {
        var findIndex = this.category.findIndex((x:any) => x._id == data.id);
        this.category[findIndex].active_book = data.active_book;
      })
  }

  public show_it() {
    if (localStorage.getItem('uploader') == '1') {
      this.alert_show = false;
      localStorage.setItem('uploader', '0');
    }
    else {
      this.alert_show = true;
    }
    this.p = new pubid(localStorage.getItem('pub-id'));

    this.booklistshow.getBooks(this.p).pipe(map(x=>JSON.parse(x)),map(x=> x.message)).subscribe(data => {
     this.loader=false;
      this.category =data;
      console.log(this.category);
      this.inddatasource();
    },(errorMessage) => {  
     
      console.log("Error Status:" + errorMessage)
      this.substring = errorMessage.substr(0, 3);

      if (this.substring != 'und') {
        // console.log("After Cutting:" +this.substring)                         
        console.error('error caught in component')
        this.errormessage = errorMessage.substr(11, 132);
        //  console.log("Error:" +  this.errormessage);
      
        console.log("this.substring:" + this.substring);
        // this.router.navigate(['404pagenotfound', this.substring]);
        this.toastr.warningToastr("Something went wrong , please try again later",'',{position:'top-center',animate:'slideFromTop',toastTimeout:50000,maxShown:'1'})
      }
      else {
        this.substring = errorMessage.substr(18, 27);
        console.log(this.substring);
        // this.router.navigate(['404pagenotfound', this.substring]);
        this.toastr.warningToastr("Something went wrong , please try again later",'',{position:'top-center',animate:'slideFromTop',toastTimeout:50000,maxShown:'1'})
      }
      this.loader=false;
     })
  
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
 

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onpage(){
   this.loader=false;
  }
  edit_bk(i:any,v1:any,flag:any){
    this.router.navigate(['publisher/viewDetails',i,v1,flag])
  }
  deleteBook(_b_id:any,_pub_id:any,index:any){
    const dialogOpen = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data:{_b_id:_b_id,_pub_id:_pub_id,_flag:'D',_type:'P'}
    });

    dialogOpen.afterClosed().subscribe(res => {
      if(!res){
      }
      else{
        console.log(index)
         this.category.splice(index,1);
         console.log(this.category);
         this.inddatasource();
      }
    })
  }

}
