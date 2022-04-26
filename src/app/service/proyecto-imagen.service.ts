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

  public lista(id: number): Observable<ProyectoImagen[]> {
    return this.httpClient.get<ProyectoImagen[]>(this.proyectoImgURL + `traer/${id}`);
  }

    public save(proyectoImg: ProyectoImagen, id: number): Observable<any> {
    return this.httpClient.post<any>(this.proyectoImgURL + `crear/${id}`, proyectoImg);
  }

   public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.proyectoImgURL + `borrar/${id}`);
  }
}
