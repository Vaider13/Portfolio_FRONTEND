import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, } from '@angular/router';
import { TokenService } from '../service/token.service';

@Injectable({
  providedIn: 'root',
})

export class GuardsService implements CanActivate {
  realRol: string;

  constructor(private tokenService: TokenService, private router: Router) { }

  //Verifica que una usuario este logueado y tenga privilegios para acceder a ciertas parte de la pagina, de no tenerlos
  //se le redirige a la pagina principal.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRol = route.data['expectedRol'];
    this.realRol = this.tokenService.isAdmin() ? 'admin' : 'user';
    if (!this.tokenService.isLogged() || expectedRol.indexOf(this.realRol) < 0) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
