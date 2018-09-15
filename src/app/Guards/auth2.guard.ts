import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class Auth2Guard implements CanActivate {
  constructor(private auth: AuthService,
    private router: Router){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return true;
    if(!this.auth.isLoggednIn()){
      
      return true;
      
    }else{
      // this.router.navigate(["login-page"]);
      this.router.navigateByUrl('/side-nav');
      console.log("access granted");
      return false;
    }
  }
}
