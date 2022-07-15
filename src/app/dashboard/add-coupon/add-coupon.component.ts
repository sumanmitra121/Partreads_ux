import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ToastrManager } from "ng6-toastr-notifications";
import { PublisherbookserviceService } from "src/app/publisherbookservice.service";
import { CouponServiceService } from "../coupon-code/coupon-service.service";
// import from "../../../assets/adminassets/js/select2dropdown.js";
// import select2 from '../../../assets/adminassets/js/select2dropdown.js';
// declare var select2:any;
declare var $: any;
declare var XLSX : any;
@Component({
  selector: "app-add-coupon",
  templateUrl: "./add-coupon.component.html",
  styleUrls: [
    "./add-coupon.component.css",
    "../../../assets/adminassets/css/font-awesome.css",
    "../../../assets/adminassets/css/apps.css",
    "../../../assets/adminassets/css/apps_inner.css",
    "../../../assets/adminassets/css/res.css",
    // "../../../assets/adminassets/css/select2.css",
    
  ],
})
export class AddCouponComponent implements OnInit {
  total_coupon:any=0
  flag: any = "B";
  checked = true;
  indeterminate = false;
  ActivelBooks: any = [];
  allBooks: any = [];
  load: boolean = false;
  counterstart:any;
  counterend:any;
  searchTxt: any;
  view_coupon:boolean=true;
  constructor(
    private router:Router,
    private toastr: ToastrManager,
    private g_coupon: CouponServiceService,
    private allbooks: PublisherbookserviceService
  ) {}
  checkResponse: any = "";
  // bk_name:any;
  book_id:any;
  frm_date:any;
  to_date:any;
  ngOnInit(): void {
    this.allbooks.getBooks().subscribe((data) => {
      this.allBooks = data;
      for (let i = 0; i < this.allBooks.message.length; i++) {
        if (this.allBooks.message[i].active_book == "A") {
          this.ActivelBooks[i] = this.allBooks.message[i];
        }
      }
    });

  }


  submit(v: any) {
    console.log(v.form.value,v.form.value.no_of_coupon);
    this.book_id='';
    this.frm_date='';
    this.to_date='';
    this.load = true;
    this.total_coupon=0;
    if (this.flag == "B") {
      if (v.form.value.startDate > v.form.value.endDate) {
        this.load = false;
        this.toastr.errorToastr("Please provide valid coupon date range", "");
      } else if (v.form.value.bookstartDate > v.form.value.bookendDate) {
        this.load = false;
        this.toastr.errorToastr("Please provide valid book date range", "");
      } else {
        var totalcount=50;
        this.counterstart=1;
        this.counterend=50;
        if(v.form.value.no_of_coupon<=totalcount){
          this.g_coupon
          .generateCoupon(
            v.form.value.bookname,
            v.form.value.no_of_coupon,
            v.form.value.startDate,
            v.form.value.endDate,
            v.form.value.bookstartDate,
            v.form.value.bookendDate,
            "",
            this.flag,
            this.counterstart,
           v.form.value.no_of_coupon
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.checkResponse = data;
              if (this.checkResponse.success == 1) {
                this.total_coupon=0;
                this.load = false;
                // this.toastr.successToastr(
                //   "Coupon code has been generated successfully",
                //   ""
                // );
                this.book_id=this.checkResponse.message.book_id;
                this.frm_date=this.checkResponse.message.coupon_from_date;
                this.to_date=this.checkResponse.message.coupon_to_date;
                this.view_coupon=false;
                $("#Reset").click();
              } else {
                this.load = false;
                this.toastr.errorToastr(
                  "Something went wrong! please try again later",
                  ""
                );
              }
            },
            (error) => {
              this.load = false;
              this.toastr.errorToastr(
                "Something went wrong! please try again later",
                ""
              );
            }
          );
        }else{
           this.total_coupon= v.form.value.no_of_coupon;
          this.splitCoupon(v.form.value.bookname,
            v.form.value.no_of_coupon,
            v.form.value.startDate,
            v.form.value.endDate,
            v.form.value.bookstartDate,
            v.form.value.bookendDate,
            this.counterstart,
            this.counterend);
          // console.log('reCall');
        }
      }
    } else {
      if (v.form.value.startDate > v.form.value.endDate) {
        this.load = false;
        this.toastr.errorToastr("Please provide valid coupon date range", "");
      } else {
        this.g_coupon
          .generateCoupon(
            "",
            "",
            v.form.value.StartDate,
            v.form.value.EndDate,
            "",
            "",
            v.form.value.creaditammount,
            this.flag,
            '',''
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.checkResponse = data;
              if (this.checkResponse.success == 1) {
                this.load = false;
                // this.toastr.successToastr(
                //   "Coupon code has been generated successfully",
                //   ""
                // );
                this.book_id='G';
                this.frm_date=this.checkResponse.message.coupon_from_date;
                this.to_date=this.checkResponse.message.coupon_to_date;
                this.view_coupon=false;
                $("#Reset").click();
              } else {
                this.load = false;
                this.toastr.errorToastr(
                  "Something went wrong! please try again later",
                  ""
                );
              }
            },
            (error) => {
              this.load = false;
              this.toastr.errorToastr(
                "Something went wrong! please try again later",
                ""
              );
            }
          );
      }
    }
  }
  checkmode(event: any) {
    this.flag = event.value;
  }
  getToday() {
    var dt = new Date();
    // console.log(dt.toISOString().substring(0, 10));
    return dt.toISOString().substring(0, 10);
  }
  splitCoupon(bk_name:any,no_of_coupon:any,start_date:any,to_date:any,bk_startDate:any,bk_toDate:any,counterstart:any,counterend:any){ 
    this.g_coupon
          .generateCoupon(
           bk_name,
           no_of_coupon,
           start_date,
           to_date,
           bk_startDate,
           bk_toDate,
            "",
            this.flag,
            counterstart,
            counterend
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.checkResponse = data;
              if (this.checkResponse.success == 1) {
                if(this.checkResponse.countend!=no_of_coupon && this.checkResponse.countend<=no_of_coupon){
                  this.counterstart = Number(this.checkResponse.countend) + 1;
                  this.counterend = Number(this.checkResponse.countend) + 50;
                   console.log( "After: "+this.counterend, Number(no_of_coupon))
                  if(this.counterend > Number(no_of_coupon)){
                    this.counterend = Number(no_of_coupon);
                    this.splitCoupon(bk_name,
                      no_of_coupon,
                      start_date,
                      to_date,
                      bk_startDate,bk_toDate,
                      this.counterstart,
                      this.counterend);
                  }else{
                    this.splitCoupon(bk_name,
                      no_of_coupon,
                      start_date,
                      to_date,
                      bk_startDate,bk_toDate,
                      this.counterstart,
                      this.counterend);
                  }
                }else{
                  //upload complete message
                  this.total_coupon=0;
                  this.load=false;
                  this.view_coupon=false;
                  this.book_id=this.checkResponse.message.book_id;
                  this.frm_date=this.checkResponse.message.coupon_from_date;
                  this.to_date=this.checkResponse.message.coupon_to_date;
                  $("#Reset").click();
                  // this.toastr.successToastr(
                  //   "Coupon code has been generated successfully",
                  //   ""
                  // );

                }
              } else {
                this.load = false;
                this.toastr.errorToastr(
                  "Something went wrong! please try again later",
                  ""
                );
              }
            },
            (error) => {
              this.load = false;
              this.toastr.errorToastr(
                "Something went wrong! please try again later",
                ""
              );
            }
          );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ActivelBooks.filter = filterValue.trim().toLowerCase();
  }

  clickToPreview(){
    this.router.navigate(['/admin/couponCode',this.book_id,this.frm_date,this.to_date]);
  }
}
