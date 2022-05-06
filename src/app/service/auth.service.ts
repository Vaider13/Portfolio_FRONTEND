import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtDTO } from '../models/jwt-dto';
import { LoginUsuario } from '../models/login-usuario';
import { NuevoUsuario } from '../models/nuevo-usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authURL = 'https://guarded-beach-45939.herokuapp.com/auth/';

  constructor( private httpClient: HttpClient) {}

  //funcion para crear un nuevo usuario.
  public nuevo(nuevoUsuario:NuevoUsuario):Observable<any> {
    return this.httpClient.post<any>(this.authURL + "nuevo", nuevoUsuario);
  }

  //Funcion para logueo de los usuarios.
  public login(loginUsuario:LoginUsuario):Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + "login", loginUsuario);
  }
}
