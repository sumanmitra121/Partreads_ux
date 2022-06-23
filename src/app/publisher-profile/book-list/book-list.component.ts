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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog,private toastr:ToastrManager,private booklistshow: BooklistService, private actv: ActivateService, private router: Router, private cookieService: CookieService) { }
  p: any;
  book_name: any;
  userData: any;
  category: any = [];
  totaldata: any = [];
  totaldata1: any = [];
  a: any;
  row_id: any;
  tick_cross: boolean = true;
  icon!: string;
  showstatus: any = [];
  link: any;
  bk_name: any;
  h4_el: any;
  src_el: any;
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
    // if (localStorage.getItem('uploader') == '1') {
    //   this.alert_show = false;
    //   localStorage.setItem('uploader', '0');
    // }
    // else {
    //   this.alert_show = true;
    // }
    // this.p = new pubid(localStorage.getItem('pub-id'));

    // this.booklistshow.getBooks(this.p).subscribe(data => {
      //  console.log(data);
      // this.userData = data;
      //  console.log(this.userData);
      // var obj = JSON.parse(this.userData);
      // this.totaldata = obj.message;
      //  console.log(this.totaldata);

      // for (let i = 0; i < this.totaldata.length; i++) {
      //   this.category[i] = this.totaldata[i];

      // }

      //  console.log(JSON.parse(this.userData.message));
    // })
      this.show_it();
      localStorage.setItem('address','/publisher/book-list');

  }
  close_alert() {
    this.alert_div = document.getElementById('uploaded');
    this.alert_div.style.display = 'none';
  }
  showbookname(v1: any, v2: any) {
    this.loader=true;
    console.log(v1 + " " + v2);
    this.bk_name = v1;
    this.link = v2;
    document.getElementById('bookname')?.remove();
    this.h4_el = document.createElement("h4");
    this.h4_el.class = "modal-title";
    this.h4_el.id = "bookname";
    this.h4_el.append(this.bk_name);
    document.getElementById('header-h4')?.appendChild(this.h4_el);
    // document.getElementById('booklink')?.remove();
    // this.src_el = document.createElement("embed");
    // this.src_el.id = "booklink";
    // this.src_el.frameborder = "0";
    // this.src_el.width = "100%";
    // this.src_el.height = "400px";
    this.link = this.link + "#toolbar=0&navpanes=0&scrollbar=0";
    //document.getElementById('modal_body_id')?.appendChild(this.src_el);
  }
  show() { showprofile(); }
  logout() {
    localStorage.removeItem('pub-token');
    localStorage.setItem('pub-loggedin', 'false');
    this.cookieService.delete('pub-cookie-name');
    this.router.navigate(['/publisher/logpub']);
  }
  activation(v1:any,v2:any){
     this.value1=v1;
     this.value2=v2;
}
  activation1() {
    // if (confirm("Are you sure to change the status?")) {
      // console.log(v1 + " " + v2);

      this.a = new activebook(this.value1,this.value2);
      this.actv.activate(this.a).subscribe(data => {
        console.log(data)
        this.book_name = data;
        var obj1 = JSON.parse(this.book_name);

        console.log(obj1.success);
        console.log(obj1.message.id);
        this.row_id = 'active' + obj1.message.id;
        location.reload();
        if (obj1.message.active_book == 'I') {
          console.log(document.getElementById(this.row_id)?.innerHTML);
          console.log(document.getElementById(this.row_id)?.firstChild?.remove());
          var appendTag = document.createElement("a");
          
          appendTag.setAttribute("class","statusCross");
           appendTag.setAttribute("click", "activation('" + obj1.message.id + "','" + obj1.message.active_book + "')");
          var iappendTag = document.createElement("i");
       
          iappendTag.setAttribute("class", "fa fa-time");
          iappendTag.setAttribute("aria-hidden", "true");
          appendTag.appendChild(iappendTag);
          document.getElementById(this.row_id)?.appendChild(appendTag);
          location.reload();
        } else if (obj1.message.active_book == 'A') {
          console.log(document.getElementById(this.row_id)?.innerHTML);
          console.log(document.getElementById(this.row_id)?.firstChild?.remove());
          var appendTag = document.createElement("a");
          // appendTag.className="statusCross";
          appendTag.setAttribute("class","statusTick");
          appendTag.setAttribute("click", "activation('" + obj1.message.id + "','" + obj1.message.active_book + "')");
          var iappendTag = document.createElement("i");
          // iappendTag.className="fa fa-times";
          iappendTag.setAttribute("class", "fa fa-check");
          iappendTag.setAttribute("aria-hidden", "true");
          appendTag.appendChild(iappendTag);
          document.getElementById(this.row_id)?.appendChild(appendTag);
          location.reload();
        }

      })

    // }


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

    this.booklistshow.getBooks(this.p).subscribe(data => {
     this.loader=false;
      this.userData = data;
      var obj = JSON.parse(this.userData);
      this.totaldata = obj.message;

      for (let i = 0; i < this.totaldata.length; i++) {
        this.category[i] = this.totaldata[i];

      }
     
      this.inddatasource();
      //  console.log(JSON.parse(this.userData.message));
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
    // alert('hello');
    console.log(i+" "+v1);
    this.router.navigate(['publisher/viewDetails',i,v1,flag])
  }
  deleteBook(_b_id:any,_pub_id:any,index:any){
    const dialogOpen = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data:{_b_id:_b_id,_pub_id:_pub_id,_flag:'D',_type:'P'}
    });

    dialogOpen.afterClosed().subscribe(res => {
      if(!res){
         console.log('failed')
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
