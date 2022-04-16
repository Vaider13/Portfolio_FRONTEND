import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  userURL = 'http://localhost:8080/usuario/'
  constructor(private httpClient: HttpClient) {}

  public getByUserName(userName:string): Observable<Usuario> {
    let params = new HttpParams().set('userName', userName);
    return this.httpClient.get<Usuario>(this.userURL + "traer", { params: params});
  }
}
