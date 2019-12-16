import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(public db: AngularFirestore) { }

  agregarItem(data){
  	let datos=data;
  	datos.fechaDeModificacion=firebase.firestore.FieldValue.serverTimestamp();
  	console.log(datos);
  	return this.db.collection('items').add(datos);
  }
  getItemsEmpresa(id){
  	return this.db.collection('items', ref => ref.where('empresa','==',id)).snapshotChanges();
  }
  eliminarItem(id){
  	return this.db.collection('items').doc(id).delete();
  }
  public editarItem(id,data){
	return this.db.collection('items').doc(id).update(data);
}	
}
