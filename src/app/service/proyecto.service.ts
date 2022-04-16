import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proyecto } from '../models/interfaces/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  proyectoURL = 'http://localhost:8080/proyecto/'

  constructor(private httpClient: HttpClient) { }

  public lista(id: number): Observable<Proyecto[]> {
    return this.httpClient.get<Proyecto[]>(this.proyectoURL + `traer/${id}`);
  }

  public getById(id: number): Observable<Proyecto> {
    return this.httpClient.get<Proyecto>(this.proyectoURL + `traerid/${id}`);
  }

  public save(proyecto: Proyecto, id: number): Observable<any> {
    return this.httpClient.post<any>(this.proyectoURL + `crear/${id}`, proyecto);
  }

  public update(id: number, proyecto: Proyecto): Observable<any> {
    return this.httpClient.put<any>(this.proyectoURL + `editar/${id}`, proyecto);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.proyectoURL + `borrar/${id}`);
  }
}
