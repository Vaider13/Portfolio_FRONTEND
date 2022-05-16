import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { environment } from 'src/environments/environment';
import { getStorage, ref, deleteObject } from "firebase/storage";


//Inicializa la aplicacion firebase, utilizada para guardar las imagenes del portfolio que se van subiendo.
firebase.initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})

export class SubirImagenesService {
  storareRef = firebase.app().storage().ref();


  constructor() { }

  //funcion que sube las imagenes al servidor, y posteriormente devuelve la URL de la imagen subida.
  async subirImagen(nombre: string, imgBase64: any) {

    try {
      let respuesta = await this.storareRef.child("users/" + nombre).putString(imgBase64, 'data_url');
      console.log(respuesta);
      return await respuesta.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  //funcion que borra una imagen del servidor
  async borrarImagen(imgUrl:string) {
    const storage = getStorage();
    // Crea una referencia para borrar la imagen
    const proyectoRef = ref(storage, imgUrl);
    // Borra el archivo
    deleteObject(proyectoRef).then(() => {
      // Archivo borrado satisfactoriamente
    }).catch((error) => {
      console.log(error.err)
      // Ocurre un error.
    });
  }
}
