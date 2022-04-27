import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoEducacion } from '../models/interfaces/estado-educacion';

@Injectable({
  providedIn: 'root'
})
export class EstadoEducacionService {
  estadoURL = 'http://localhost:8080/estado/'

  constructor(private httpClient: HttpClient) { }

  //Trae la lista de todos los estados de educacion.
  public lista(): Observable<EstadoEducacion[]> {
    return this.httpClient.get<EstadoEducacion[]>(this.estadoURL + `traer`);
  }
}
