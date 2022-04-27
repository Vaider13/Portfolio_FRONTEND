import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  roles: Array<String> = [];

  constructor(private router: Router) { }

  //Guarda el token en el almacenamiento local.
  public setToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  //Borra los datos almacenados localmente
  public logOut(): void {
    window.localStorage.clear();
    this.router.navigate(['']);
  }

  //Funcion que determina si se esta logueado o no.
  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  //Obtiene el token almacenado localmente.
  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY)!;
  }

  //Obtiene el nombre de usuario por medio del token.
  public getUserName(): string {
    if(!this.isLogged()) {
      return null!;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const userName = values.sub;
    return userName;
  }

  //Funcion que determina si un usuario tiene privilegios de administrador.
  public isAdmin():boolean  {
    if(!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const roles = values.roles;
    if (roles.indexOf('ROLE_ADMIN') < 0) {
      return false;
    }
    return true;
  }

}
