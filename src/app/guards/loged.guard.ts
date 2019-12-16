import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FireService } from '..//services/fire.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogedGuard implements CanActivate{
    constructor(public auth: FireService) {}
 
  canActivate(): boolean {
  	console.log(this.auth.usuario);
  	if(this.auth.auth)
    	return true;
  	return false;
	}
}
