import { Educacion } from './../models/interfaces/educacion';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EducacionService {

  educacionURL = 'http://localhost:8080/portfolio/educacion/'

  constructor(private httpClient: HttpClient) { }

  public lista(id:number): Observable<Educacion[]> {
    return this.httpClient.get<Educacion[]>(this.educacionURL + `traer/${id}`);
  }

  public getById(id:number): Observable<Educacion> {
    return this.httpClient.get<Educacion>(this.educacionURL + `traerid/${id}`);
  }

  public save(educacion:Educacion, id:number): Observable<any> {
    return this.httpClient.post<any>(this.educacionURL + `crear/${id}`, educacion);
  }

  public update(id:number, educacion:Educacion): Observable<any> {
    return this.httpClient.put<any>(this.educacionURL + `editar/${id}`, educacion);
  }

  public delete(id:number): Observable<any> {
    return this.httpClient.delete<any>(this.educacionURL + `borrar/${id}`);
  }

}
