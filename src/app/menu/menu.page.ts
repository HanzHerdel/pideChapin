import { Component, OnInit } from '@angular/core';
import {AlertController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MenusService } from '../services/menus.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {FireService} from '../services/fire.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
/**************variables creacion de items**********/
item={nombre:"",
      descripcion:"",
      valor:"",
      tipo:"",
      comentarios:"",
      empresa:"",
      urlImg:"",
      pathImg:""}
/************* variables de creacion de imagenes *********/
  imagen:File;
  file: File;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  nombreImg="Seleccione una imagen";//variable para el label html
  tiposItems=environment.tiposItems;
/**************variables edicion de items**********/
  itemAEditar:any;
  imagenEditar:File;
  fileEditar: File;
  taskEditar: AngularFireUploadTask;

  snapshotEditar: Observable<any>;
  downloadURLEditar: string;
  nombreImgEditar="Seleccione una imagen";//variable para el label html  
  //tiposUsuario= environment.tiposUsuarioModerador;
  //tiposEmpresa=environment.tiposEmpresaModerador;
  empresaId:string;
  items:any;
  constructor(public alertCtrl:AlertController,
    private storage: AngularFireStorage,
    private auth:FireService,
    private data: MenusService) {
        this.empresaId= this.auth.usuario.empresa;
        this.item.empresa=this.empresaId;
        console.log(this.item.empresa);
        this.data.getItemsEmpresa(this.empresaId).subscribe(changes =>{
                  this.items=[];
                  changes.map(a => {
                    const data =  a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    let resEd = { id,  ...data };
                    console.log(resEd);
                    this.items.push(resEd);
                  });
        });
       }

  ngOnInit() {

  }

  /******************** Creacion items ******************/
  imgNuevoItemSeleccionada(e){
    this.file=e.target.files[0];
    this.nombreImg=this.file.name;
  }

  crearItem(form){
    console.log(form);
    if(form.valid){
        if(this.file){
          const path = `fotos/${this.empresaId}/${Date.now()}_${this.file.name}`;
          this.item.pathImg=path;
          // referencia al budget de firebase storage para obtencion del url
          const ref = this.storage.ref(path);
          // referencia a tarea de subida para esperar el resultado
          this.task = this.storage.upload(path, this.file);
          //subscripcion a la tarea
          this.task.snapshotChanges().subscribe(changes=> console.log(changes,"changes")
              , err=>console.log(err)
              , async()=>{console.log("completado");
                this.item.urlImg=await ref.getDownloadURL().toPromise();
                console.log(this.item,"item**");          
                this.data.agregarItem(this.item)
                  .then(()=>{ 
                    this.alerta("Éxito","datos agregados");
                    this.limpiarForm(form);
                  })
                  .catch(err=> {console.log(err,"*");this.alerta("Error","ha ocurrido un error inesperado")});
            });
        // monitoreo de estado
          this.task.percentageChanges().subscribe(val => console.log(val,"persent"));
        }else{
          console.log(this.item,"item sin img");
          this.data.agregarItem(this.item)
                  .then(()=>{ 
                    this.alerta("Éxito","datos agregados");
                    this.limpiarForm(form);})
                  .catch(err=> {console.log(err,"**");this.alerta("Error","ha ocurrido un error inesperado")});
        }
    }
  }

    limpiarForm(form){
      this.item.empresa=this.empresaId,
        form.reset();
        this.nombreImg="Seleccione una imagen";
        console.log("data limpia");
    }
  /**********************************************************/
  /***************************** editar items *******************************/
  editar(editarForm){
    console.log(editarForm.value);
    if (editarForm.valid){
      let datos={
          nombre:editarForm.value.nombre,
          descripcion:editarForm.value.descripcion,
          valor:editarForm.value.valor,
          tipo:editarForm.value.tipo,
          comentarios:editarForm.value.comentarios,
        };
      console.log(this.fileEditar)
      if(this.fileEditar){
          console.log("imagen cambiada");
          const path = `fotos/${this.empresaId}/${Date.now()}_${this.fileEditar.name}`;
          datos['pathImg']=path;
          // referencia al budget de firebase storage para obtencion del url
          const ref = this.storage.ref(path);
          //borrar del storage imagen existente
          console.log("...");
          if(this.itemAEditar.pathImg.length > 1){
            //this.storage.ref(this.itemAEditar.pathImg).delete().subscribe(x=>{console.log("borrado")},err=>{console.log("Errorsin",err)});
            console.log(".....");
            console.log(this.itemAEditar.urlImg);
             this.storage.storage.refFromURL(this.itemAEditar.urlImg).delete()
             .then(val => console.log("borrado",val))
             .catch(err=>console.log("error al eliminar: ",err))
           }
              //.catch(err=>console.log("no borrado",err));
          
          // referencia a tarea de subida para esperar el resultado
          console.log("creando subida");
          this.taskEditar = this.storage.upload(path, this.fileEditar);
          //subscripcion a la tarea
          console.log("subiendo imagen");
          this.taskEditar.snapshotChanges().subscribe(changes=> console.log(changes,"changes")
              , err=>{console.log(err);this.alerta("Error","ha ocurrido un error inesperado");}
              , async()=>{console.log("completado");
                datos['urlImg']=await ref.getDownloadURL().toPromise();
                console.log(datos,"itemEditar**");          
                this.data.editarItem(this.itemAEditar.id,datos)
                  .then(()=>{
                        this.alerta("Éxito","elemento editado"); 
                        editarForm.reset();
                        this.nombreImgEditar="Seleccione una imagen";
                        this.itemAEditar=null;
                  })
                  .catch(err=> {console.log(err,"*");this.alerta("Error","ha ocurrido un error inesperado")});
            });
      }
      else{
        this.data.editarItem(this.itemAEditar.id,datos)
          .then(()=>{ 
                this.alerta("Éxito","elemento editado"); 
                editarForm.reset();
                this.nombreImgEditar="Seleccione una imagen";
                this.itemAEditar=null;
          })
          .catch(err=> {console.log(err,"*");this.alerta("Error","ha ocurrido un error inesperado")});  
      }
    }
  }
  imgEditarItemSeleccionada(e){
    this.fileEditar=e.target.files[0];
    this.nombreImgEditar=this.fileEditar.name;
    console.log("editarImagen selec", this.nombreImgEditar);
  }
  seleccionarItemAEditar(item){
    console.log(item);
    this.itemAEditar=item;
  }
  eliminarItemConfirmar(id){
   this.eliminarAlert("Eliminar", "¿Está seguro de eliminar esta entrada?",id) 
  }
  eliminarItem(id){
     this.data.eliminarItem(id)
         .then(()=>{
            this.alerta("Éxito","entrada eliminada","",1000);
          })
          .catch(err=>{this.alerta("Ups","algo salio mal","",1000);});
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
          this.eliminarItem(id);
          }
        }
      ]
    });
      await alert.present();
      setTimeout(()=>{try{alert.dismiss()}catch{}}, 2000);
  }
  }
