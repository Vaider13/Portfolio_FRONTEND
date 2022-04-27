import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExperienciaLaboral } from '../models/interfaces/experiencialaboral';

@Injectable({
  providedIn: 'root'
})
export class ExperiencialaboralService {
  trabajoURL = 'http://localhost:8080/trabajo/'

  constructor(private httpClient: HttpClient) { }

  //Trae todas las experiencias laborales pertenecientes a una persona por medio de su ID.
  public lista(id:number): Observable<ExperienciaLaboral[]> {
    return this.httpClient.get<ExperienciaLaboral[]>(this.trabajoURL + `traer/${id}`);
  }

   //Trae una experiencia laboral por medio de su ID.
  public getById(id:number): Observable<ExperienciaLaboral> {
    return this.httpClient.get<ExperienciaLaboral>(this.trabajoURL + `traerid/${id}`);
  }

  //Guarda una nueva experiencia laboral perteneciente a una persona, por medio del ID de la misma.
  public save(trabajo:ExperienciaLaboral, id:number): Observable<any> {
    return this.httpClient.post<any>(this.trabajoURL + `crear/${id}`, trabajo);
  }

  //Actualiza una experiencia laboral por medio de su ID.
  public update(id:number, trabajo:ExperienciaLaboral): Observable<any> {
    return this.httpClient.put<any>(this.trabajoURL + `editar/${id}`, trabajo);
  }

  //Borra una experiencia laboral por medio de su ID.
  public delete(id:number): Observable<any> {
    return this.httpClient.delete<any>(this.trabajoURL + `borrar/${id}`);
  }


}
