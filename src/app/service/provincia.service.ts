import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provincia } from '../models/interfaces/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  provinciaURL = 'http://localhost:8080/portfolio/provincia/'

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Provincia[]> {
    return this.httpClient.get<Provincia[]>(this.provinciaURL + `traer`);
  }
}
