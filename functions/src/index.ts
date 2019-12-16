const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
/************* borrar perfil usuario al borrar correo de identificacion *//////////////////////
exports.deleteUser = functions.firestore
    .document('users/{userID}')
    .onDelete((snap:any, context:any) => {
    	console.log("borrado detectado");
    	console.log(snap,context);
      return admin.auth().deleteUser(snap.id)
          .then(() => console.log('Usuario Eliminado:' + snap.id))
          .catch((error) => console.error('There was an error while deleting user:', error));
    });
/**************** crear usuario al crear perfil de usuario****************************/
exports.createUser = functions.firestore
    .document('users/{userID}')
    .onCreate((snap:any, context:any) => {
    //	console.log("creacion detectada");
    	console.log(snap);
    //	console.log(snap.get("nombre"));
    	const id=snap.id;
    	admin.firestore().doc("users/"+id).update({
    			password:"",
    		}).then(x =>{console.log(x)}).catch(err => console.log(err));
        return admin.auth().createUser({
        	uid:id,
        	email:snap.get("correo"),
          password:snap.get("password"),
          id:id,
        })
          .then(() => console.log('Usuario creado:'+id))
          .catch((error) => console.error('hubo un error al crear el usuario:', error));
        // return true
    });
  
    exports.createItem = functions.firestore
    .document('items/{itemID}')
    .onCreate((snap:any, context:any) => {
    //	console.log("creacion detectada");
    	console.log(snap);
    //	console.log(snap.get("nombre"));
    	const id=snap.id;
    	return admin.firestore().doc("items/"+id).update({
    			id:id,
    		}).then(x =>{console.log(x)}).catch(err => console.log(err))
          .catch((error) => console.error('hubo un error al agregar Id:', error));
        // return true
    });
    exports.createEmpresa = functions.firestore
    .document('empresas/{empresaID}')
    .onCreate((snap:any, context:any) => {
    //	console.log("creacion detectada");
    	console.log(snap);
    //	console.log(snap.get("nombre"));
    	const id=snap.id;
    	return admin.firestore().doc("empresas/"+id).update({
    			id:id,
    		}).then(x =>{console.log(x)}).catch(err => console.log(err))
          .catch((error) => console.error('hubo un error al agregar Id:', error));
        // return true
    });