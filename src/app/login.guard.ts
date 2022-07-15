import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router : Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      let url: string = state.url;  
      return this.verifyLogin(url);
     
     
  }
  

  verifyLogin(url:string) : any{
      if(!this.isLoggedIn()){
        //this.router.navigate(['/login']);
          //this.router.navigate([window.location.href]);
          return false;
      }
      else if(this.isLoggedIn()){
          return true;
      }
          
  }
  public isLoggedIn(): boolean{
      let status = false;
      if( localStorage.getItem('isLoggedIn') == "true"){
        status = false;
      }
      else{
        status = true;
      }
      return status;
  }
 
  
}

