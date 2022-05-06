import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Localidad } from '../models/interfaces/localidad';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  localidadURL = 'https://guarded-beach-45939.herokuapp.com/localidad/'

  constructor(private httpClient: HttpClient) { }

  //Trae todas las localidades pertenecientes a una provincia por medio de su ID.
  public lista(provinciaId:number): Observable<Localidad[]> {
    return this.httpClient.get<Localidad[]>(this.localidadURL + `traer/${provinciaId}`);
  }

  //Guarda una nueva localidad perteneciente a una provincia, identificandola por su ID.
  public save(localidad:Localidad): Observable<any> {
    return this.httpClient.post<any>(this.localidadURL + `crear`, localidad);
  }
}
