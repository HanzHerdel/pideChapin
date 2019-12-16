import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FireService } from '..//services/fire.service';
@Injectable({
  providedIn: 'root'
})
export class ModeradorGuard implements CanActivate {
	constructor(public auth: FireService){}
  canActivate(): boolean {
  	console.log(this.auth.usuario);
  	if(this.auth.usuario && (this.auth.usuario.permisos=="moderador" || this.auth.usuario.permisos=="admin")){
    	return true;//this.auth.isAuthenticated();
  	}
  	return false;
	}
  
}
