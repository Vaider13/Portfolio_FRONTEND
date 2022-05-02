import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExperienciaIdioma } from '../models/interfaces/experiencia-idioma';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaIdiomaService {

  idiomaURL = 'http://localhost:8080/experienciaidioma/'

  constructor(private httpClient: HttpClient) { }

  //Trae todas los idiomas pertenecientes a una persona por medio de su ID.
  public lista(id:number): Observable<ExperienciaIdioma[]> {
    return this.httpClient.get<ExperienciaIdioma[]>(this.idiomaURL + `traer/${id}`);
  }

   //Trae un idioma por medio de su ID.
  public getById(id:number): Observable<ExperienciaIdioma> {
    return this.httpClient.get<ExperienciaIdioma>(this.idiomaURL + `traerid/${id}`);
  }

  //Guarda un nuevo idioma perteneciente a una persona, por medio del ID de la misma.
  public save(idioma:ExperienciaIdioma, id:number): Observable<any> {
    return this.httpClient.post<any>(this.idiomaURL + `crear/${id}`, idioma);
  }

  //Actualiza un idioma por medio de su ID.
  public update(id:number, idioma:ExperienciaIdioma): Observable<any> {
    return this.httpClient.put<any>(this.idiomaURL + `editar/${id}`, idioma);
  }

  //Borra un idiomal por medio de su ID.
  public delete(id:number): Observable<any> {
    return this.httpClient.delete<any>(this.idiomaURL + `borrar/${id}`);
  }

}
