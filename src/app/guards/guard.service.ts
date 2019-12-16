import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { FireService } from '..//services/fire.service';
@Injectable({
  providedIn: 'root'
})
export class LogedGuard implements CanActivate  {
  constructor(public auth: FireService) {}
 
  canActivate(): boolean {
  	if(this.auth.auth)
    	return true;//this.auth.isAuthenticated();
  	return false;
  }
}

 



