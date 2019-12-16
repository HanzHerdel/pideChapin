import { Component, OnInit } from '@angular/core';
import {FireService} from '../services/fire.service';
import {AdministracionService} from '../services/administracion.service';
import {AlertController,LoadingController  } from '@ionic/angular';
import { environment } from '../../environments/environment';

//import {NgForm} from '@angular/forms';
@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {
/******variables creacion y edicion usuarios**********/
//@ViewChild('usuario') usuario : NgForm;
usuario={correo:"", password:"", nombre:"", apellido:"", movil:"", tel:"", dir:"", permisos:""};
usuarios:any;
tiposUsuario=environment.tiposUsuarioAdmin;
usuariosDeEmpresa:any;
usuarioAEditar={correo:"", nombre:"", apellido:"", movil:"", tel:"", dir:"", permisos:"",id:""};
/************************** variables edicion de empresas ********************************************/
empresaNueva={nombre:"", telE:"", movil:"", dir:"", tipo:""};
empresaEditar={nombre:"", telE:"", movil:"", dir:"", tipo:"",id:""};
empresas:any;

tiposEmpresa=environment.tiposEmpresaAdmin;

  constructor(private auth: FireService,
  			   public alertCtrl: AlertController,
           private db:AdministracionService,
           public loadingController: LoadingController,) { 
              this.db.getEmpresas().subscribe(changes => {
                this.empresas=[];
                 changes.map(a => {
                    const data =  a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    let resEd = { id,  ...data };
              //      console.log(resEd);  
                    this.empresas.push(resEd);
                  })
               });
                if (this.auth.usuario.permisos==='admin'){
                 console.log('admin');
                  this.tiposUsuario.push(  {tipo:'Administrador',val:'admin'});
                }
                this.db.getUsuarios().subscribe(changes =>{
                            this.usuarios=[];
                                        changes.map(a => {
                                const data =  a.payload.doc.data() as any;
                                const id = a.payload.doc.id;
                                let resEd = { id,  ...data };
                                this.usuarios.push(resEd);
                              });
                });

  }
    /*************************** creacion modificacion usuarios **************************************/
  crearUsuario(form) {
      console.log(form.value,this.usuario);
    if(form.valid){
      let data= form.value;
      data.correo = data.correo.toLowerCase();
      let loading=   this.crearLoading();
      loading.then(async x=>{return await x.present()});
      let subs=this.auth.buscarUsuarioCorreo(data.correo).subscribe(usr=>{
          subs.unsubscribe();
          if (usr.length >0){
            this.alerta('Error','','el correo ya esta registrado');
           loading.then(async x=>{x.dismiss();});
            return
          }else{
            this.db.crearUsuario(data).then(()=>{
              this.alerta('Usuario creado','','continuemos...');
              form.reset();
              loading.then(async x=>{x.dismiss();});
            }).catch(err=>{console.log(err);this.alerta('Ups','','ha ocurrido un error inesperado.');});
          }
      });
    }
  }
  getUsuariosEmpresa(empresa){
        this.db.getUsuariosEmpresa(empresa).subscribe(changes =>{
                  this.usuariosDeEmpresa=[];
                  changes.map(a => {
                    const data =  a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    let resEd = { id,  ...data };
                    this.usuariosDeEmpresa.push(resEd);
                  });
        });
  }


editarUsuario(formEditar){
  console.log(formEditar.value);
  console.log(this.usuarioAEditar);
  if(formEditar.valid){
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
        this.alerta("Éxito","usuario eliminado","",1000);
      })
      .catch(err=>{this.alerta("Ups","algo salio mal","",1000);});
}
seleccionarUsuarioAEditar(usr){
  console.log(usr);
  this.usuarioAEditar=usr;
}

  ngOnInit() {
  }
  ngAfterViewInit() {

   
  }
/************************ creacion y modificacion empresas ************************************/
agregarEmpresa(formEmpresa){
  console.log(formEmpresa);
  console.log(this.empresaNueva);
  if(formEmpresa.valid){
  let data = formEmpresa.value
  console.log(data);
      this.db.crearEmpresa(data).then(()=>{
        this.alerta('Empresa creada','','continuemos...');
        formEmpresa.reset();
        }).catch(err=>{console.log(err);this.alerta('Ups','','ha ocurrido un error inesperado.');});
    }
}
editarEmpresa(editarForm){
    console.log(editarForm);
    let id= this.empresaEditar.id;
    let data=(editarForm.value)
  if( editarForm.valid){
    console.log(id);
    this.db.editarEmpresa(id,data).then(()=>{
          this.alerta('Empresa Editada','','continuemos...');
          editarForm.reset();
          }).catch(err=>{console.log(err);this.alerta('Ups','','ha ocurrido un error inesperado.');});
  }
}
//mostrar/ocultar tarjetas
  switch(e){
    let elem=document.getElementById(e);
    if (elem.classList.contains('colapsar')){
      elem.classList.remove('colapsar');
    }else{
      elem.classList.add('colapsar');
    }

  }
  compareWithFn(o1, o2) {//necesaria para la funcionalidad de ion-select con objetos como valor
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

 // compareWith = this.compareWithFn;

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

  async crearLoading(mensaje="",tiempo=2000) {
   let c = await this.loadingController
            .create({
              message: 'Loading',
              duration:tiempo,
            })
            return c;
   /* const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');*/
  }
}
