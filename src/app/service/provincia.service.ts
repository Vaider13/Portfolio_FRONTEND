import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provincia } from '../models/interfaces/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  provinciaURL = 'https://guarded-beach-45939.herokuapp.com/provincia/'

  constructor(private httpClient: HttpClient) { }

  //Se obtienen todas las provincias.
  public lista(): Observable<Provincia[]> {
    return this.httpClient.get<Provincia[]>(this.provinciaURL + `traer`);
  }

  //Se obtiene una provincia por medio de su nombre.
  public getProvincia(provincia:string): Observable<Provincia> {
    return this.httpClient.get<Provincia>(this.provinciaURL + `traer/${provincia}`);
  }
}
