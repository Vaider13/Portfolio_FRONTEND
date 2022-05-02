import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idioma } from '../models/interfaces/idioma';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  idiomaURL = 'http://localhost:8080/idioma/'

  constructor(private httpClient: HttpClient) { }

  //Trae todas los idiomas pertenecientes a una persona por medio de su ID.
  public lista(): Observable<Idioma[]> {
    return this.httpClient.get<Idioma[]>(this.idiomaURL + `traer`);
  }

   //Trae un idioma por medio de su ID.
  public getById(id:number): Observable<Idioma> {
    return this.httpClient.get<Idioma>(this.idiomaURL + `traerid/${id}`);
  }

  //Guarda un nuevo idioma perteneciente a una persona, por medio del ID de la misma.
  public save(idioma:Idioma): Observable<any> {
    return this.httpClient.post<any>(this.idiomaURL + `crear`, idioma);
  }
}
