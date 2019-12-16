import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

export interface User{
						tipo:string,
						sueprUser:boolean,
						nombre:string,
						telefono:string
						}
@Injectable({
  providedIn: 'root'
})
export class FireService {
  auth:any;//info auth
  public usuario:any;//usuario
	private usersCollection:AngularFirestoreCollection<User>;  
	//public itemsConId:Array<any>;
  constructor(private firebaseAuth: AngularFireAuth, 
  			   public db: AngularFirestore,) {
    this.usersCollection= db.collection<User>('users');
// evento de autentificacion bilateral dijera xD
    this.firebaseAuth.authState.subscribe((auth) => {
              this.auth = auth;
            });
}

    /************************ configuracion de logeo y usuarios *//////////////
	getSubscriptionAuth(){
	return  this.firebaseAuth.authState;
	}
 	public getUsuario(id:string=""){
 		return this.usersCollection.doc(id).valueChanges();
 	}
  public buscarUsuarioCorreo(correo){
    return this.db.collection('users', ref => ref.where('correo', '==',correo)).snapshotChanges()
      /*then(docSnapshot => {
        if (docSnapshot.exists) {
          // do something
        }*/
  }
  public getEmpresaUsuario(id){
    return this.db.collection('empresas').doc(id).valueChanges();    
  }
	login(email: string="", password: string=""){
    return this.firebaseAuth
      .auth.signInWithEmailAndPassword(email, password);
  	}

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }
  /***************************** servicios de datos **********************/
  /************************** administracion *****************************/
 
}