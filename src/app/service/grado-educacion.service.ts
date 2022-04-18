import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GradoEducacion } from '../models/interfaces/grado-educacion';

@Injectable({
  providedIn: 'root'
})
export class GradoEducacionService {

  gradoURL = 'http://localhost:8080/grado/'

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<GradoEducacion[]> {
    return this.httpClient.get<GradoEducacion[]>(this.gradoURL + `traer`);
  }
}
