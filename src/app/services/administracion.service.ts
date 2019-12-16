import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
/*import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';*/


@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

  constructor(public db: AngularFirestore) { }

   	 public getEmpresas(){
	 	return	this.db.collection('empresas').snapshotChanges();
	 }
	 public getRestaurantes(){
		return	this.db.collection('empresas' , ref => ref.where('tipo','==','restaurante')).valueChanges();
	}
	 public crearUsuario(data){
	 	return	this.db.collection('users').add(data);
	 }
	 public getUsuarios(){
	 	return	this.db.collection('users').snapshotChanges();	
	 }
	 public getUsuariosEmpresa(empresa){
			return	this.db.collection('users',ref =>ref.where("empresa","==",empresa)).snapshotChanges();	
	 }
	 public editarUsuario(data,id){
	    return this.db.collection('users').doc(id).update(data);	 
    }
    public eliminarUsuario(id){
    	return this.db.collection('users').doc(id).delete();
    }
    public crearEmpresa(data){
    	return this.db.collection('empresas').add(data);
    }
    public editarEmpresa(id,data){
    	return this.db.collection('empresas').doc(id).update(data);
    }	
     async getEmpresa(id){
    	return await this.db.collection('empresas').doc(id).valueChanges();
                                                                  }
}
