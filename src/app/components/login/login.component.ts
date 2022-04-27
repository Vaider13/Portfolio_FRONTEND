import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  @ViewChild('loginForm') login: ElementRef;
  formLoggin: FormGroup;
  userName: string;
  isLogged: boolean = false;
  isLoggedFail:boolean =false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    //Creacion del formulario para loguearse en el Portfolio
    this.formLoggin = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    })
  }

  //Comprueba que no se este logueado.
  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged()
  }

  //Abre el modal de logueo.
  openModal(): void {
    this.modalService.open(this.login)
  }

  //Ingresado los datos, verifica que este todo correcto, obtiene el token, y recarga la pagina para que se cargarguen
  //los apartados que requieren autenticacion, si indica que no hubo errores, si hubo un error se muestra al usuario el mismo.
  public onSubmit(): void  {
    if (this.formLoggin.valid) {
      this.authService.login(this.formLoggin.value).subscribe(
        (data) => {
          this.isLoggedFail=false;
          this.tokenService.setToken(data.token);
          window.location.reload();
        },
        (err) => {
          console.log(err);
          this.isLoggedFail=true;
          this.formLoggin.reset();
        }
      );

    } else {
      this.formLoggin.markAllAsTouched();
    }
  }

  //Se cierra la sesion, y posteriormente se
  //refresca la pagina para que desaparezcan los apartados que requieren autenticacion.
  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }

  //Getters del formulario reactivo.
  get password() {
    return this.formLoggin.get("password");
  }

  get nombreUsuario() {
    return this.formLoggin.get("nombreUsuario");
  }
}
