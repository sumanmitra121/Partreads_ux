import { Component, OnInit, ViewChild} from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { UtilityTService } from 'src/app/Utility/utility-t.service';
import { GetOrderHistoryService } from './get-order-history.service';
declare var XLSX : any;
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css',
  '../../../assets/cssfiles/bootstrap.css',
  '../../../assets/cssfiles/font-awesome.css',
  '../../../assets/chosen/chosen.css',
  '../../../assets/cssfiles/apps.css',
  '../../../assets/cssfiles/res.css',
  '../../../assets/cssfiles/apps_inner.css']
})
export class OrderHistoryComponent implements OnInit  {

  @ViewChild('logForm') LogForm!:NgForm;
  displayedColumns: any[] = ['No','orderId', 'bookname','authorname', 'TotalPurchasedPages','Amount','DateOfPurchase'];
  dataSource=new MatTableDataSource();
  x:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
   order_history:any=[];
   maxDate:any;
   message:any;
   loading:boolean=true;
   base_dt:any=[];
  constructor(private utilyT:UtilityTService,private orderHistory:GetOrderHistoryService) { 
  }

  ngOnInit(): void {
    // this.loading=true;
    this.fetchdata();}
  fetchdata(){
     this.orderHistory.getOrderHistory(localStorage.getItem('u-id'), localStorage.getItem('user-type_user'), localStorage.getItem('remember_token')).subscribe(data=>{
    //  console.log(data)
      this.order_history=data;
      this.order_history=this.order_history.message;
      // console.log(this.order_history);
      if(this.order_history.length > 0){
      for(let i=0;i<this.order_history.length;i++){
        this.base_dt.push({order_id:this.order_history[i].order_id,book_name:this.order_history[i].book_details.book_name
        ,author_name:this.order_history[i].book_details.author_name,book_page_no:this.order_history[i].book_page_no,
        total_price:this.order_history[i].total_price,date:this.order_history[i].date});
      }         
     }
      this.putdata(this.base_dt);
     })
  }
  putdata(v:any){
    this.dataSource=new MatTableDataSource(v);
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort;
    this.loading=false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim(); // Remove whitespace
    var FilterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = FilterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  submitDate(v:Form){
     if(this.LogForm.form.value.startDate > this.LogForm.form.value.endDate){
       this.message="From date can not be greater than to date";
      this.utilyT.showToastr(this.message,'E');
      }
     else{
         this.loading=true;
         this.orderHistory.getOrderHistoryByDate(localStorage.getItem('u-id'), localStorage.getItem('user-type_user'),localStorage.getItem('remember_token'),this.LogForm.form.value.startDate,this.LogForm.form.value.endDate).subscribe(data=>{
          this.base_dt.length=0;
          this.order_history.length=0;
           this.order_history=data;
            this.order_history=this.order_history.message;
            if(this.order_history.length > 0){
              for(let i=0;i<this.order_history.length;i++){
                this.base_dt.push({order_id:this.order_history[i].order_id,book_name:this.order_history[i].book_details.book_name
                ,author_name:this.order_history[i].book_details.author_name,book_page_no:this.order_history[i].book_page_no,
                total_price:this.order_history[i].total_price,date:this.order_history[i].date});
              }         
             }
              this.putdata(this.base_dt);
         })
     }

  }
  getToday(){//For Getting Date Only
    return new Date().toISOString().substring(0,10);
  }

  importAsXlsx(){
      if(this.base_dt.length > 0){
      let data=document.getElementById('data_table');
      var fp=XLSX.utils.table_to_book(data,{sheet:'Sheet1'});
      XLSX.write(fp,{
        bookType:'xlsx',
        type:'base64'
      });
      XLSX.writeFile(fp,'Payment.xlsx');
    }
    else{
         this.utilyT.showToastr('No payment history available to download','E');
    }
    }
}
