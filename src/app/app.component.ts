import { Component } from '@angular/core';

import { Platform,MenuController,NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {FireService} from './services/fire.service';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
/*    {title: 'Ordenes', url: '/ordenes', icon: 'list'},
    {title: 'Restaurantes', url: '/restaurantes', icon: 'home'    },
    {title: 'Administracion', url: '/administracion', icon: 'list'},*/
  ];
   //usuario:any;
   logeado:boolean=false;
   empresa:any=[];
  constructor(private platform: Platform,private splashScreen: SplashScreen,private statusBar: StatusBar,public menuCtrl: MenuController,
              private authFire:FireService,private navCtrl: NavController,
      ) {
      this.initializeApp();
      this.navCtrl.navigateBack(['login']);
      this.authFire.getSubscriptionAuth().subscribe((auth)=>{
          //limpieza de variables al iniciar
          this.authFire.usuario=null;
         // this.usuario=null;
          this.appPages = [];
        if(auth == null)//si no esta logeado regresar a login
          {
            this.logeado=false;
            this.navCtrl.navigateBack(['login']);
        // this.rootPage = 'HomePage';
          }else{
            //console.log(auth);
            this.logeado=true;//activar menu
            
            this.authFire.getUsuario(auth.uid).subscribe(usr=>{
              if(usr){
                this.authFire.usuario=usr;
                this.navCtrl.navigateForward(['ordenes-activas']);//navegar al pricipio
                let subs=this.authFire.getEmpresaUsuario(this.authFire.usuario.empresa).subscribe(empresa=> {
                        this.authFire.usuario.empresaInfo=empresa;
                        this.empresa=empresa;
                        if(usr['permisos']=='admin'){ 
                              //console.log("admin");            
                            this.appPages = [
                                          {title: 'Ordenes Activas', url: '/ordenes-activas', icon: 'ios-send'},
                                          {title: 'Crear Ordenes', url: '/ordenes', icon: 'list'},
                                          {title: 'Restaurantes', url: '/restaurantes', icon: 'home'},
                                          {title: 'Administracion', url: '/administracion', icon: 'md-build'},

                                        ];
                            }else if(usr['permisos']=='moderador'){
                              
                                  this.appPages = [
                                          {title: 'Ordenes Activas', url: '/ordenes-activas', icon: 'ios-send'},
                                          {title: 'Crear Ordenes', url: '/ordenes', icon: 'list'},
                                          {title: 'Miscelánea', url: '/menu', icon: 'apps'},
                                          {title: 'Administracion', url: '/moderador', icon: 'md-build'},
                                        ];
                            }else{
                              this.appPages = [
                                {title: 'Ordenes Activas', url: '/ordenes-activas', icon: 'ios-send'},
                                {title: 'Crear Ordenes', url: '/ordenes', icon: 'list'},
                              ];
                            }
                            subs.unsubscribe();
                            });
                        }
                  });
              }
      });            
  }
salir(){
  this.authFire.logout();
}
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
