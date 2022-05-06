import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proyecto } from '../models/interfaces/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  proyectoURL = 'https://guarded-beach-45939.herokuapp.com/proyecto/'

  constructor(private httpClient: HttpClient) { }

   //Trae todos los proyectos pertenecientes a una persona por medio de su ID.
  public lista(id: number): Observable<Proyecto[]> {
    return this.httpClient.get<Proyecto[]>(this.proyectoURL + `traer/${id}`);
  }

  //Trae un proyecto por medio de su ID.
  public getById(id: number): Observable<Proyecto> {
    return this.httpClient.get<Proyecto>(this.proyectoURL + `traerid/${id}`);
  }

  //Guarda un nuevo proyecto perteneciente a una persona, por medio del ID de la misma.
  public save(proyecto: Proyecto, id: number): Observable<any> {
    return this.httpClient.post<any>(this.proyectoURL + `crear/${id}`, proyecto);
  }

  //Actualiza un proyecto por medio de su ID.
  public update(id: number, proyecto: Proyecto): Observable<any> {
    return this.httpClient.put<any>(this.proyectoURL + `editar/${id}`, proyecto);
  }

  //Borra un proyecto por medio de su ID.
  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.proyectoURL + `borrar/${id}`);
  }
}
