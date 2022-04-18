import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Localidad } from '../models/interfaces/localidad';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  localidadURL = 'http://localhost:8080/localidad/'

  constructor(private httpClient: HttpClient) { }

  public lista(provinciaId:number): Observable<Localidad[]> {
    return this.httpClient.get<Localidad[]>(this.localidadURL + `traer/${provinciaId}`);
  }
}
