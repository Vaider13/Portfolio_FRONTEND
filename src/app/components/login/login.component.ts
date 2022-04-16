import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';
import { UsuarioService } from 'src/app/service/usuario.service';


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
    private userService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.formLoggin = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    })
  }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged()
  }

  openModal(){
    this.modalService.open(this.login)
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  get Password() {
    return this.formLoggin.get("password");
  }

  get NombreUsuario() {
    return this.formLoggin.get("nombreUsuario");
  }

  public onSubmit() {
    if (this.formLoggin.valid) {
      this.authService.login(this.formLoggin.value).subscribe(
        (data) => {
          this.isLoggedFail=false;
          this.tokenService.setToken(data.token);
          this.userName = this.tokenService.getUserName();
          this.userService.getByUserName(this.userName).subscribe(
            data => {
              localStorage.setItem("personaId", data.id.toString())
            },
            err => {
              console.log(err);
            }
          );
          setTimeout(() => { this.router.navigate(['portfolio']) }, 1000);
          this.closeModal();
        },
        (err) => {
          console.log(err);
          this.isLoggedFail=true;
        }
      );

    } else {
      this.formLoggin.markAllAsTouched();
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
  }
}
