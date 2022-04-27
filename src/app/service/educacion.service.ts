import { Educacion } from './../models/interfaces/educacion';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EducacionService {

  educacionURL = 'http://localhost:8080/educacion/'

  constructor(private httpClient: HttpClient) { }

  //Trae todos los estudios pertenecientes a una persona por medio de su ID.
  public lista(id:number): Observable<Educacion[]> {
    return this.httpClient.get<Educacion[]>(this.educacionURL + `traer/${id}`);
  }

  //Trae un estudio por medio de su ID.
  public getById(id:number): Observable<Educacion> {
    return this.httpClient.get<Educacion>(this.educacionURL + `traerid/${id}`);
  }

  //Guarda un nuevo estudio perteneciente a una persona, por medio del ID de la misma.
  public save(educacion:Educacion, id:number): Observable<any> {
    return this.httpClient.post<any>(this.educacionURL + `crear/${id}`, educacion);
  }

  //Actualiza un estudio por medio de su ID.
  public update(id:number, educacion:Educacion): Observable<any> {
    return this.httpClient.put<any>(this.educacionURL + `editar/${id}`, educacion);
  }

  //Borra un estudio por medio de su ID.
  public delete(id:number): Observable<any> {
    return this.httpClient.delete<any>(this.educacionURL + `borrar/${id}`);
  }

}
