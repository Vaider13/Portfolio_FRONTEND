import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { RedSocial } from 'src/app/models/interfaces/red-social';
import { RedsocialService } from 'src/app/service/redsocial.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-redes-sociales',
  templateUrl: './redes-sociales.component.html',
  styleUrls: ['./redes-sociales.component.css']
})
export class RedesSocialesComponent implements OnInit {

  redesSociales: RedSocial;
  //ReGex que verifica si se ingreso una URL valida.
  urlReg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  personaId: number = 1;
  formRedes: FormGroup;
  @ViewChild('redes') redes: ElementRef;
  isLogged: boolean = false;
   //Configuraciones del modal.
   options: NgbModalOptions = {
    animation: true,
    scrollable: true,
    centered: true,
    backdrop: 'static'
  }

  constructor(private modalService: NgbModal,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private redSocialService: RedsocialService) {
    //Creacion del formulario reactivo.
    this.formRedes = this.formBuilder.group({
      facebook: ['', [Validators.pattern(this.urlReg)]],
      twitter: ['', [Validators.pattern(this.urlReg)]],
      instagram: ['', [Validators.pattern(this.urlReg)]],
      linkedin: ['', [Validators.pattern(this.urlReg)]],
    })
  }

  //Se llama a la funcion para cargar la URL de las redes sociales.
  ngOnInit(): void {
    this.cargarRedes();
    this.isLogged = this.tokenService.isLogged()
  }

  //Se carga la URL de las redes sociales.
  cargarRedes(): void  {
    this.redSocialService.getById(this.personaId).subscribe(
      data => {
        this.redesSociales = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Se cargan los datos de las redes en el formulario para su posterior edicion.
  editarRedes(): void  {
    this.openModal(this.redes);
    this.redSocialService.getById(this.personaId)
      .pipe(first())
      .subscribe(x => this.formRedes.patchValue(x));
  }

  //Abre el modal para editar las redes.
  openModal(content: any): void  {
    this.modalService.open(content, this.options)
  }

  //Se llama a la funcion para guardar las redes.
  onSubmit(): void  {
    this.editarRedesDb();
  }

  //Se guardan las URL de las redes en la base de datos.
  editarRedesDb(): void  {
    this.redSocialService.update(this.personaId, this.formRedes.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarRedes();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //getters del formulario.
  get instagram() {
    return this.formRedes.get("instagram");
  }

  get facebook() {
    return this.formRedes.get("facebook");
  }

  get twitter() {
    return this.formRedes.get("twitter");
  }

  get linkedin() {
    return this.formRedes.get("linkedin");
  }


}
