// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebase:  {
    apiKey: "AIzaSyDXqaxhRAAQnfBUUoQQdnh0euNSDG2OGk8",
    authDomain: "pidechapin-qtech.firebaseapp.com",
    databaseURL: "https://pidechapin-qtech.firebaseio.com",
    projectId: "pidechapin-qtech",
    storageBucket: "pidechapin-qtech.appspot.com",
    messagingSenderId: "731163401688"
  },
  
  tiposUsuarioAdmin:[{tipo:'Moderador',val:'moderador'},
          {tipo:'Usuario',val:'usuario'},
          {tipo:'Repartidor',val:'repartidor',},
          ],
  tiposEmpresaAdmin:['restaurante', 'otro'],

  tiposUsuarioModerador:[
          {tipo:'Moderador',val:'moderador'},
          {tipo:'Usuario',val:'usuario'}
          ]
          ,
  tiposEmpresaModerador:['restaurante', 'otro'],
  tiposItems:['desayuno','almuerzo','boquita','entremés','bebida','postre','refaccion','cena','otro'],
  estadosDeOrden:['en espera','confirmado','en camino','entregado'],
  tiempoBajo:20,
  tiempoMedio:30,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
