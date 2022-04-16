import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExperienciaLaboral } from '../models/interfaces/experiencialaboral';

@Injectable({
  providedIn: 'root'
})
export class ExperiencialaboralService {
  trabajoURL = 'http://localhost:8080/portfolio/trabajo/'

  constructor(private httpClient: HttpClient) { }

  public lista(id:number): Observable<ExperienciaLaboral[]> {
    return this.httpClient.get<ExperienciaLaboral[]>(this.trabajoURL + `traer/${id}`);
  }

  public getById(id:number): Observable<ExperienciaLaboral> {
    return this.httpClient.get<ExperienciaLaboral>(this.trabajoURL + `traerid/${id}`);
  }

  public save(trabajo:ExperienciaLaboral, id:number): Observable<any> {
    return this.httpClient.post<any>(this.trabajoURL + `crear/${id}`, trabajo);
  }

  public update(id:number, trabajo:ExperienciaLaboral): Observable<any> {
    return this.httpClient.put<any>(this.trabajoURL + `editar/${id}`, trabajo);
  }

  public delete(id:number): Observable<any> {
    return this.httpClient.delete<any>(this.trabajoURL + `borrar/${id}`);
  }


}
