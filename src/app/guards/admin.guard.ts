import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FireService } from '..//services/fire.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate  {
  constructor(public auth: FireService) {}
 
  canActivate(): boolean {
  	console.log(this.auth.usuario);
  	if(this.auth.usuario && this.auth.usuario.permisos=="admin")
    	return true;//this.auth.isAuthenticated();
  	return false;
	}
}