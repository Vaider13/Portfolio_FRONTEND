import { ProyectoImagen } from './../models/interfaces/proyecto-imagen';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoImagenService {

  constructor(private httpClient: HttpClient) { }

  proyectoImgURL = 'http://localhost:8080/proyectoImagenes/'

  //Se trae las URL de las imagenes pertenecientes a un proyecto por medio de su ID.
  public lista(): Observable<ProyectoImagen[]> {
    return this.httpClient.get<ProyectoImagen[]>(this.proyectoImgURL + `traer`);
  }
  //Se guarda la URL de la imagen de un proyecto por medio de su ID.
  public save(proyectoImg: ProyectoImagen, id: number): Observable<any> {
    return this.httpClient.post<any>(this.proyectoImgURL + `crear/${id}`, proyectoImg);
  }

  //Se borra la URL de una imagen por medio de su ID.
  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.proyectoImgURL + `borrar/${id}`);
  }
}
