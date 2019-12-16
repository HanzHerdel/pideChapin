import { Component, OnInit } from '@angular/core';
import {FireService} from '../services/fire.service';
import {AdministracionService} from '../services/administracion.service';
import {AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-moderador',
  templateUrl: './moderador.page.html',
  styleUrls: ['./moderador.page.scss'],
})
export class ModeradorPage implements OnInit {
	empresaDelUsuario:any;
/******variables creacion y edicion usuarios**********/
usuario={correo:"",
      password:"",
      nombre:"",
      apellido:"",
      movil:"",
      tel:"",
      dir:"",
      permisos:""}
 tiposUsuario= environment.tiposUsuarioModerador;
tiposEmpresa=environment.tiposEmpresaModerador;
/***************** variables edicion usuarios ***********************/
usuariosDeEmpresa:any;
usuarioAEditar:any;
empresaEditar:any;
  constructor(public alertCtrl:AlertController, public db:AdministracionService ,private auth: FireService) {
  	console.log(this.auth.usuario.empresa); 
  	this.db.getUsuariosEmpresa(this.auth.usuario.empresa).subscribe(changes =>{
                  this.usuariosDeEmpresa=[];
                  changes.map(a => {
                    const data =  a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    let resEd = { id,  ...data };
                    this.usuariosDeEmpresa.push(resEd);
                  });
        });
  	this.empresaEditar=this.auth.usuario.empresaInfo;
  }
  ngOnInit() {

  }
  /***************** edicion usuarios ******************/
    crearUsuario(form) {
    if (form.valid){
	    let data= form.value;
	    data.correo = data.correo.toLowerCase();
	    data.empresa= this.auth.usuario.empresa;
	    console.log(data);
	    let subs=this.auth.buscarUsuarioCorreo(data.correo).subscribe(usr=>{
	        subs.unsubscribe();
	        if (usr.length >0){
	          this.alerta('Error','','el correo ya esta registrado');
	          return
	        }else{
	          this.db.crearUsuario(data).then(()=>{
	            this.alerta('Usuario creado','','continuemos...');
	            form.reset();
	          }).catch(err=>{console.log(err);this.alerta('Ups','','ha ocurrido un error inesperado.');});
	        }
	    });
	}
  }
  /********************** editar usuarios ********************************/
  editarUsuario(formEditar){
  	if (formEditar.valid){
  console.log(formEditar.value);
  let id=this.usuarioAEditar.id;
  this.db.editarUsuario(formEditar.value,id)
      .then(()=>{
        this.alerta("Éxito","usuario editado correctamente","",1000);
      })
      .catch(err=>{this.alerta("Ups","algo salio mal","",1000);});
  }
}
eliminarUsuario(id){
 this.eliminarAlert("Eliminar", "¿Está seguro de eliminar este usuario?",id) 
}
eliminarUsr(id){
 this.db.eliminarUsuario(id)
     .then(()=>{
        this.alerta("Éxito","elemento eliminado","",1000);
      })
      .catch(err=>{this.alerta("Ups","algo salio mal","",1000);});
}
  seleccionarUsuarioAEditar(usr){
  console.log(usr);
  this.usuarioAEditar=usr;
}

/********************** editar empresa ********************************/
editarEmpresa(editarForm){
    console.log(editarForm);
    let id= this.auth.usuario.empresa;
    let data=(editarForm.value)
  if( editarForm.valid){
    console.log(id);
    this.db.editarEmpresa(id,data).then(()=>{
          this.alerta('Empresa Editada','','continuemos...');
          editarForm.reset();
          }).catch(err=>{console.log(err);this.alerta('Ups','','ha ocurrido un error inesperado.');});
  }
}
/*mostrar/ocultar tarjetas*/
  switch(e){
    let elem=document.getElementById(e);
    if (elem.classList.contains('colapsar')){
      elem.classList.remove('colapsar');
    }else{
      elem.classList.add('colapsar');
    }

  }


/*************************** Alertas / loading**************************/
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
  async eliminarAlert(titulo:string="", text:string="",id:string) {
  const alert = await this.alertCtrl.create({
    header:titulo,
    subHeader:text,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: data => {            
        }
      },
      {
        text: 'Aceptar',
        handler: data => {
        this.eliminarUsr(id);
        }
      }
    ]
  });
    await alert.present();
    setTimeout(()=>{try{alert.dismiss()}catch{}}, 2000);
}

}
