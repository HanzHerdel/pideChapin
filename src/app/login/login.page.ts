import { Component, OnInit } from '@angular/core';
import {FireService} from '../services/fire.service';
import {AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 usuario:string;
  pass:string;
  constructor( public fireProv: FireService,
  			   public alertCtrl: AlertController,) {
  }
    ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

   login() {
     //console.log(this.authService.user);
     console.log("accediendo");
     this.fireProv.login(this.usuario, this.pass).then(value => {
        console.log(value,'Login Complete');

      })  
      .catch(async(err) =>  {
            const alert = await this.alertCtrl
            		.create({header: "Error al ingresar",
            			subHeader:"credenciales incorrectas"});

            await alert.present();
            setTimeout(()=>{try{alert.dismiss()}catch{}}, 600);
        console.log('Error al ingresar:',err.message);  });
  }

}