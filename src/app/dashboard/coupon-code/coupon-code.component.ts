import { AfterViewInit, Component, OnInit ,ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PublisherbookserviceService } from 'src/app/publisherbookservice.service';
import { CouponServiceService } from './coupon-service.service';
// import * as '../../../assets/js/select2.js'
// declare var select2:any;
declare var $:any;
declare var XLSX : any;

@Component({
  selector: 'app-coupon-code',
  templateUrl: './coupon-code.component.html',
  styleUrls: ['./coupon-code.component.css',
  '../../../assets/adminassets/css/font-awesome.css',
  '../../../assets/adminassets/css/apps.css',
  '../../../assets/adminassets/css/apps_inner.css',
  '../../../assets/adminassets/css/res.css']
})
export class CouponCodeComponent implements OnInit, AfterViewInit {
   @ViewChild('logform') logFrom!:NgForm
   b_id:any;
   f_date:any;
   t_date:any;
  constructor(private Activatedrouter:ActivatedRoute,private router:Router,private toastr:ToastrManager,private g_coupon:CouponServiceService,private allbooks:PublisherbookserviceService) {
    if(this.Activatedrouter.snapshot.params['book_id'] !='0'){
      this.b_id=this.Activatedrouter.snapshot.params['book_id']=='G' ? '' : this.Activatedrouter.snapshot.params['book_id'];
      this.f_date=this.Activatedrouter.snapshot.params['frm_date'];
      this.t_date=this.Activatedrouter.snapshot.params['to_date']; 
    }
    else{
      this.b_id="";
      this.f_date="";
      this.t_date="";
    }
   console.log( this.b_id+" "+this.f_date+" "+this.t_date)
   }
  displayedColumns: string[] = ['No', 'name','isbn','startDate','bookstartDate','generated date','total coupon','Action'];
  dataSource = new MatTableDataSource();
  allBooks:any=[];
  allcoupons:any=[];
  WindowObject:any;
  divToPrint:any;
  arr:any=[];
  base_dt:any=[];
  ActivelBooks:any=[];
  checkResponse:any;
  loader:boolean=true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  book_name:any;
  auth_name:any;
  isbn:any;
  ngOnInit(): void {
    // this.displayedColumns=this.b_id=='' ? ['No', 'name','isbn','startDate','bookstartDate','generated date','total coupon','CouponList'] : ['No', 'name','isbn','startDate','bookstartDate','generated date','total coupon','Action'];
    this.getToday();
    this.allbooks.getBooks().subscribe(data=>{
      this.allBooks=data;
      this.allBooks=this.allBooks.message;
      for(let i=0;i<this.allBooks.length;i++){
        // if(this.allBooks[i].active_book=='A'){
          this.ActivelBooks[i]=this.allBooks[i];
        // }
      }
  
      if(this.Activatedrouter.snapshot.params['book_id'] !='0'){ 
        this.logFrom.setValue({book_name:this.b_id,startDate:this.f_date,endDate: this.t_date});
        // this.allcoupons.length=0;
        // this.arr.length=0;
        this.base_dt.length=0;
        this.g_coupon.searchCoupon(this.b_id,this.f_date,this.t_date).subscribe(data=>{
          this.base_dt=data;
          this.base_dt=this.base_dt.message;
          // console.log(this.base_dt)
          this.loader=false;
        $('#showTable').fadeToggle("slow");
          this.dataSource=new MatTableDataSource(this.base_dt);
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort;
       },error=>{
         this.toastr.errorToastr('Something went wrong! please try again later','');
       })
       
      }
      else{
        this.loader=false;
      }   
    
    })
    $(document).ready(function(){
      $('#myselect').select2();
    })

    
    // this.g_coupon.searchCoupon('').subscribe(data=>{console.log(data);})
    
  }
  ngAfterViewInit(): void{
    // $('#select2').select2();

  }

  submitForm(logForm:any){
    this.loader=true;
    if(logForm.form.value.startDate!='' && logForm.form.value.endDate==''){
    this.loader=false;
      this.toastr.errorToastr('Please select end date','');
    }
    else if(logForm.form.value.book_name=='' && logForm.form.value.startDate=='' && logForm.form.value.endDate==''){
    this.loader=false;
    this.toastr.errorToastr('Either select a book name  or specify date range to view details of coupon','');
    }
    else if(logForm.form.value.startDate > logForm.form.value.endDate){
    this.loader=false;
    this.toastr.errorToastr('Please provide valid date range','');

    }
    else{
      if($('#showTable').is(':visible')){}
      else{$('#showTable').fadeToggle("slow");}
      this.allcoupons.length=0;
      this.arr.length=0;
       this.b_id=logForm.form.value.book_name;     
      console.log(logForm.form.value.book_name);
      // this.displayedColumns=this.b_id=='' ? ['No', 'name','isbn','startDate','bookstartDate','generated date','total coupon','CouponList'] : ['No', 'name','isbn','startDate','bookstartDate','generated date','total coupon','Action'];
      this.g_coupon.searchCoupon(logForm.form.value.book_name,logForm.form.value.startDate,logForm.form.value.endDate).subscribe(data=>{
        this.base_dt.length=0;
        this.base_dt=data;
         this.base_dt=this.base_dt.message;
         console.log(this.base_dt)
         this.dataSource=new MatTableDataSource(this.base_dt);
         this.dataSource.paginator=this.paginator;
         this.dataSource.sort=this.sort;
         this.loader=false;

      },error=>{
        this.toastr.errorToastr('Something went wrong! please try again later','');
        this.loader=false;
      })
    }

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addCard(){
    // window.scrollTo(0,document.body.scrollHeight);
  // if($('#generateCouponCard').is(':visible')){}
  // else{$("#generateCouponCard").fadeToggle("slow");}
  this.router.navigate(['/admin/addCoupon']);
  }
  showHide(mode:any){$(mode=='A' ? "#generateCouponCard" : "#showTable").fadeToggle("slow");}
  // submit(v: any){
  //   if(v.form.value.startDate > v.form.value.endDate){
  //     this.toastr.errorToastr('Please provide valid coupon date range','')}
  //   else if(v.form.value.bookstartDate > v.form.value.bookendDate){
  //     this.toastr.errorToastr('Please provide valid book date range','')
  //   }
  //   else{     
  //     this.g_coupon.generateCoupon(v.form.value.bookname,v.form.value.no_of_coupon,v.form.value.startDate,
  //       v.form.value.endDate,v.form.value.bookstartDate,v.form.value.bookendDate).subscribe(data=>{
  //         console.log(data);
  //          this.checkResponse=data;
  //          if( this.checkResponse.success==1){this.toastr.successToastr('Coupon code has been generated successfully','');
  //           $('#Reset').click();}
  //          else{this.toastr.errorToastr('Something went wrong! please try again later','')}
  //       },error=>{
  //         this.toastr.errorToastr('Something went wrong! please try again later','')
  //       })
  //   }

  // }
  downloadPdf(){
    console.log($("#ss option:selected").text().split('|')[0]+'_'+$("#ss option:selected").text().split('|')[1])
    this.divToPrint = document.getElementById('BoarddivToPrint_1');
    // console.log(this.divToPrint)
    this.WindowObject = window.open('', 'Print-Window');
    this.WindowObject.document.open();
    this.WindowObject.document.writeln('<!DOCTYPE html>');
    this.WindowObject.document.writeln('<html><head><title class="text-center">'+$("#ss option:selected").text().split('|')[0]+'_'+$("#ss option:selected").text().split('|')[1]+'</title><style type="text/css">');
    this.WindowObject.document.writeln('@media print { .center { text-align: center;}' +
            '                                         .inline { display: inline; }' +
            '                                         .underline { text-decoration: underline; }' +
            '                                         .left { margin-left: 315px;} ' +
            '                                         .right { margin-right: 375px; display: inline; }' +
            '                                          table { border-collapse: collapse; font-size: 10px;width:100%}' +
            '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
            '                                           th, td {width:1%; text-align:center}'+
            '                                         .border { border: 1px solid black; } ' +
            '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } '+
            '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
            '                                         td.dashed-line { border-top: 1px dashed gray; } } </style>');
      this.WindowObject.document.writeln('</head><body onload="window.print()">');
      this.WindowObject.document.writeln('<center><img src="/assets/images/logo.png" alt="">'+
      '<h4>'+this.allcoupons[0].book_name+ '</h4>' +
      '<h5 style="text-muted"> by '+this.allcoupons[0].author_name+'</h5>'+
      '<h5>ISBN: '+this.allcoupons[0].isbn_no+'</h5></center>');
      this.WindowObject.document.writeln(this.divToPrint.innerHTML);
      this.WindowObject.document.writeln('<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>');
      this.WindowObject.document.writeln('</body></html>');
      this.WindowObject.document.close();
    setTimeout(() => {
      console.log("CLose");
      this.WindowObject.close();
    }, 300);
  }
  getToday(){
    var dt=new Date();
    console.log(dt.toISOString().substring(0,10));
    return dt.toISOString().substring(0,10);
    //  return new Date().toSubs
  }

// Receive user input and send to search method**
onKey(e:any) { 
  console.log(e)
this.allBooks = this.search(e.target.value);
console.log(this.allBooks);
}

// Filter the states list and send back to populate the selectedStates**
search(value: any) { 
  console.log(value)
  let filter = value.toLowerCase();
  return this.ActivelBooks.filter((option:any) => option.toString().startsWith(filter));
}
download(auth_name:any,b_name:any,isbn:any,b_id:any,frm_dt:any,to_dt:any){
// console.log(b_id,frm_dt,to_dt);
 this.book_name=b_name;
 this.auth_name=auth_name;
 this.isbn=isbn;
this.loader=true;
this.allcoupons.length=0;
this.g_coupon.downloadcoupon(b_id,frm_dt,to_dt).subscribe(data=>{
   console.log(data);
    this.allcoupons=data;
    this.allcoupons=this.allcoupons.message;
     setTimeout(() => {
     this.loader=false;
      // this.divToPrint = document.getElementById('BoarddivToPrint_1');
      // this.WindowObject = window.open('', 'Print-Window');
      // this.WindowObject.document.open();
      // this.WindowObject.document.writeln('<!DOCTYPE html>');
      // this.WindowObject.document.writeln('<html><head><title>'+b_name+'_'+isbn+'</title><style type="text/css">');
      // this.WindowObject.document.writeln('@media print { .center { text-align: center;}' +
      //         '                                         .inline { display: inline; }' +
      //         '                                         .underline { text-decoration: underline; }' +
      //         '                                         .left { margin-left: 315px;} ' +
      //         '                                         .right { margin-right: 375px; display: inline; }' +
      //         '                                          table { border-collapse: collapse; font-size: 10px;width:100%}' +
      //         '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
      //         '                                           th, td {width:1%; text-align:center}'+
      //         '                                         .border { border: 1px solid black; } ' +
      //         '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } '+
      //         '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
      //         '                                         td.dashed-line { border-top: 1px dashed gray; } title{display:none;} } </style>');
      //   this.WindowObject.document.writeln('</head><body onload="window.print()">');
      //   this.WindowObject.document.writeln('<center><img src="/assets/images/logo.png" alt="">'+
      //   '<h4>'+b_name+ '</h4>' +
      //   '<h5 style="text-muted"> by '+auth_name+'</h5>'+
      //   '<h5>ISBN: '+isbn+'</h5></center>');
      //   this.WindowObject.document.writeln(this.divToPrint.innerHTML);
      //   this.WindowObject.document.writeln('<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>');
      //   this.WindowObject.document.writeln('</body></html>');
      //   this.WindowObject.document.close();
      // setTimeout(() => {
      //   console.log("CLose");
      //   this.WindowObject.close();
      // }, 3000);
      let data=document.getElementById('tables');
      var fp=XLSX.utils.table_to_book(data,{sheet:'sheet1'});
      XLSX.write(fp,{
        bookType:'xlsx',
        type:'base64'
      });
      XLSX.writeFile(fp,b_name+'_'+isbn+'.xlsx');
     }, 20000);
})
}
filterFunction(){

}
}
