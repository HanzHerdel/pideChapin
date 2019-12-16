import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(public db: AngularFirestore) {

   }
     	getItemsDeEmpresa(empresa){
  		return	this.db.collection('items',ref =>ref.where("empresa","==",empresa)).snapshotChanges();	
    }
    obtenerItemsDeEmpresa(empresa){
  		return	this.db.collection('items',ref =>ref.where("empresa","==",empresa)).valueChanges();	
  	}
  	crearOrden(data){
  		let fecha=firebase.firestore.FieldValue.serverTimestamp();
  		data.fechaDeCreacion=fecha;
  		data.fechaDeModificacion=fecha;
  		return this.db.collection('ordenes').add(data);
  	}
  	getOrdenesDeEmpresaActivas(empresa){
      //si la empresa es pideChapin devuelve todas las ordenes activas
      if(empresa==="Ug2YeISm4sbCorQDbqvE"){
        return this.db.collection('ordenes',ref =>ref.where("activo","==",true)).snapshotChanges();
      }else
  		return	this.db.collection('ordenes',ref =>ref.where("empresa","==",empresa).where("activo","==",true)).snapshotChanges();
  	}

    editarEstadoOrden(id,estado){
      let fechaDeModificacion=firebase.firestore.FieldValue.serverTimestamp();
      let data= {fechaDeModificacion, estado:estado};
      if(estado=="entregado"){
        data['activo']=false;
      }
      console.log(data);

      return this.db.collection('ordenes').doc(id).update(data);
    }
}
