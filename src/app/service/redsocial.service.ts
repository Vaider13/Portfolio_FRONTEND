import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RedSocial } from '../models/interfaces/red-social';

@Injectable({
  providedIn: 'root'
})
export class RedsocialService {

  redesURL = 'http://localhost:8080/redes/'

  constructor(private httpClient: HttpClient) { }

  public getById(id: number): Observable<RedSocial> {
    return this.httpClient.get<RedSocial>(this.redesURL + `traer/${id}`);
  }

  public save(redSocial: RedSocial, id: number): Observable<any> {
    return this.httpClient.post<any>(this.redesURL + `crear/${id}`, redSocial);
  }

  public update(id: number, redSocial: RedSocial): Observable<any> {
    return this.httpClient.put<any>(this.redesURL + `editar/${id}`, redSocial);
  }

}
