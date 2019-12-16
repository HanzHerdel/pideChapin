import { AdministracionService } from './../services/administracion.service';
import { Component, OnInit } from '@angular/core';
import { OrdenesService } from '../services/ordenes.service';
import { environment } from '../../environments/environment';
import {FireService} from '../services/fire.service';
import {AlertController } from '@ionic/angular';
@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
})
export class OrdenesPage implements OnInit {
empresaId:string;
empresaIdOrden:string;
/********* variables carrito y seleccion ***************/
tiposItems=['todos', ...environment.tiposItems];
itemsEmpresa:any; 
itemsSeleccionados:any;
_tipoSeleccionado:string='todos';
restauranteSelectId:string='';
listaItems=[];
restaurantes:any;//=[];
/**************** variables creacion de ordenes **********************/
orden={nombre:"", direccion:"", tel:"", estado:"", comentarios:"", items:{}, total:0,empresa:"",activo:true};
estados=environment.estadosDeOrden;
constructor(private dbOrdenes:OrdenesService, public alertCtrl: AlertController,private auth:FireService , private administracion:AdministracionService) {
				this.empresaId= this.auth.usuario.empresa;
				if(this.esPideChapin()){
					this.restaurantes=this.administracion.getRestaurantes();
				}else{
					this.empresaIdOrden=this.auth.usuario.empresa;
					 this.dbOrdenes.getItemsDeEmpresa(this.empresaId).subscribe(changes =>{
								this.itemsEmpresa=[];
								changes.map(a => {
									const data =  a.payload.doc.data() as any;
									const id = a.payload.doc.id;
									let resEd = { id,  ...data };
									console.log(resEd);
									this.itemsEmpresa.push(resEd);
								});
						});
				}

						
  }

  ngOnInit() {
  }

  /************************* Interfaz *************************/
  	tipoSeleccionado(tipo){
		if(tipo=="todos"){
			this.itemsSeleccionados=[];
			console.log(this.itemsEmpresa);
			this.itemsSeleccionados= this.itemsEmpresa;
			console.log(this.itemsSeleccionados);
		}
		if (this._tipoSeleccionado!=tipo){
			this._tipoSeleccionado=tipo;
			this.itemsSeleccionados=[];
			for(let item of this.itemsEmpresa){
				if(item.tipo==tipo){
					this.itemsSeleccionados.push(item)
				}
			}
		}
	}
	truncar(texto){
		let truncado=texto;
		let logitudMax =85;
		    if (texto.length > logitudMax) {
			        truncado = texto.substr(0,logitudMax) + '...';
			    }
    return truncado;
	}
	/********************para pide chapin *********************/
	restauranteSeleccionado(restaurante){

		console.log(restaurante.id);
		this.empresaIdOrden=restaurante.id;
		if(this.restauranteSelectId!=restaurante.id){
				this.restauranteSelectId=restaurante.id;
				this.dbOrdenes.getItemsDeEmpresa(restaurante.id).subscribe(changes =>{
					this.itemsEmpresa=[];
					console.log("**",changes);
					changes.map(a => {
						const data =  a.payload.doc.data() as any;
						const id = a.payload.doc.id;
						let resEd = { id,  ...data };
						console.log(resEd);
						this.itemsEmpresa.push(resEd);
					});
					
				this.tipoSeleccionado('todos');
			});
		}
	}

	/************************** carrito items ***********************/
  agregarItem(item){
  	console.log(item);
  	for (let _item of this.listaItems){
  		if(_item.id == item.id ){
  			_item.cantidad+=1;
  			console.log(_item);
  			return;
  		}
  	}
  	this.listaItems.push({nombre:item.nombre,
  						 id:item.id,
  						 valor:item.valor,
  						 cantidad:1,
  						 descripcion:item.descripcion,
  						 urlImg:item.urlImg,
  					})
	}

  	quitarItem(item){
  		for( var i = 0; i < this.listaItems.length; i++){ 
  			console.log(this.listaItems[i]);
		   if ( this.listaItems[i].id === item.id) {
		   	if(this.listaItems[i].cantidad>1){
		   		this.listaItems[i].cantidad--;
		   	}else{
		      this.listaItems.splice(i, 1); 
		   	}
		   }
  		}
  	}
  	totalLista(){
		if (this.listaItems.length>0){
			let total=0;
			for(let item of this.listaItems){
				total+=item.cantidad*item.valor;
			}
			return total;
		}else{
			return 0;
		}  		
  	}
  	/**************************** ordenes *********************************/
	crearOrden(form){
		console.log(form.value)
		console.log(this.orden);
		this.orden.items=this.listaItems;
		this.orden.total=this.totalLista();
		this.orden.empresa=this.empresaIdOrden;
		console.log(this.orden);
		if(form.valid){
			this.dbOrdenes.crearOrden(this.orden)
			.then( ()=>{
				this.alerta('Orden creada!','','continuemos...');
				form.reset();
				this.listaItems=[];
				this.orden.total=0;
				console.log(this.orden);
			})
			.catch(err => {console.log(err);this.alerta('Ups','','Algo salio mal...');})
		}
	}
	/************************** alertas ****************************************/
	/*******************************permisos ***********************************/
	tienePermisos(){
	 return	this.auth.usuario.permisos!='moderador'|| this.auth.usuario.permisos!='admin';
	}
	esPideChapin(){
		console.log("empresa",this.empresaId);
		return this.empresaId==="Ug2YeISm4sbCorQDbqvE";
	}
	async alerta(titulo='',subTitulo='',mensaje='',tiempo=2000) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subTitulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
    setTimeout(()=>{try{alert.dismiss()}catch{}}, tiempo);
  }

}
