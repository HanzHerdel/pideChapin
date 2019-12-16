import { Component, OnInit } from '@angular/core';
import { OrdenesService } from '../services/ordenes.service';
import { environment } from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {FireService} from '../services/fire.service';
import {AlertController } from '@ionic/angular';


import { Subscription } from 'rxjs';
@Component({
  selector: 'app-ordenes-activas',
  templateUrl: './ordenes-activas.page.html',
  styleUrls: ['./ordenes-activas.page.scss'],
})
export class OrdenesActivasPage implements OnInit {
empresaId:string;
///////// variables para las etiquetas de colores segun el tiempo
tiempoBajo=environment.tiempoBajo;
tiempoMedio=environment.tiempoMedio;

estados=environment.estadosDeOrden;

ordenes=[];
fechaActual=new Date();
actualizador:any;
temporizador:any;
contador=0;

suscripciones:Subscription;
  constructor(private dbOrdenes:OrdenesService, public alertCtrl: AlertController,private auth:FireService) { 
  		this.empresaId= this.auth.usuario.empresa;
  		console.log(this.auth.usuario);
  		//this.temporizador= this.testTempo();
      
  	}
  	ionViewWillEnter(){
  		  this.suscripciones= this.dbOrdenes.getOrdenesDeEmpresaActivas(this.empresaId).subscribe(changes =>{
          this.ordenes=[];
          this.fechaActual = new Date();
          clearTimeout(this.temporizador);
	          changes.map(a => {
	            const data =  a.payload.doc.data() as any;
	            const id = a.payload.doc.id;
	            console.log(data, this.fechaActual);
	            let transcurrido;
	            try { transcurrido=Math.trunc((this.fechaActual.getTime() - data['fechaDeCreacion'].toDate().getTime())/60000);
	            }catch(err){
	            	console.log(err);
	            }
	            let resEd = { transcurrido,id,  ...data };
	           // 
	          //  console.log(resEd);           	
	            this.ordenes.push(resEd);
	          	
	          });
	          ////////////////// temporizador cada 10 segundos para actualizar el tiempo de cada orden
	          var that=this;
	  		  setTimeout(function myTimer() {
				  let horaActual= new Date();
				  for (let item of  that.ordenes){
				  	item.transcurrido= Math.trunc((horaActual.getTime() - item.fechaDeCreacion.toDate().getTime())/60000);
				  }
				  that.temporizador = setTimeout(myTimer, 10000);

				}, 10000);
		});
  	}

  	  ionViewWillLeave(){
  	console.log("desuscripcion");
  	this.suscripciones.unsubscribe();
  }

  ngOnInit() {

		}
estadoSeleccionado(item){
	console.log("cambio");
	//console.log(item,);
	let estado=item.estado;
	this.dbOrdenes.editarEstadoOrden(item.id, estado).then(()=>{
		console.log("estado actualizado")
	}).catch(err=>{console.log(err)});
}
/************************************ permisos **********************************/
tienePermisos(){
	return	this.auth.usuario.permisos!='moderador'|| this.auth.usuario.permisos!='admin';
 }
}



