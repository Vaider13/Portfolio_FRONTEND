import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Provincia } from 'src/app/models/interfaces/provincia';
import { PersonaDto } from 'src/app/models/interfaces/persona-dto';
import { PersonaService } from 'src/app/service/persona.service';
import { Localidad } from 'src/app/models/interfaces/localidad';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProvinciaService } from 'src/app/service/provincia.service';
import { LocalidadService } from 'src/app/service/localidad.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css'],
})
export class EncabezadoComponent implements OnInit {
  personaId: number = parseInt(localStorage.getItem('personaId')!);
  personaDto: PersonaDto;
  editAvatar: boolean = false;
  editPerso:boolean = false;
  formPerso: FormGroup;
  localidades: Localidad[] = [];
  provincias: Provincia[] = [];
  provinciaId: number;
  @ViewChild('persona') perso: ElementRef;

  constructor(private personaService: PersonaService,
    private modalService: NgbModal,
    private provinciaService: ProvinciaService,
    private localidadService: LocalidadService,
    private formBuilder: FormBuilder,) {
    this.formPerso = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      localidad: ['', [Validators.required]],
      acerca_de: ['', [Validators.required]],
      urlAvatar: [''],
      urlBanner: ['']
    })
  }

  ngOnInit(): void {
    this.getPersona();
    this.getProvincias();
    this.getLocalidades(1);
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'personaModal' })
  }

  onSubmit() {
    this.editarPersonaDb();
    this.modalService.dismissAll(); //Se descarta el modal
  }

  getPersona() {
    this.personaService.getPersonaByUsuarioId((this.personaId)).subscribe(
      data => {
        this.personaDto = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  getProvincias() {
    this.provinciaService.lista().subscribe(
      data => {
        this.provincias = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  getLocalidades(provinciaId: number) {
    this.localidadService.lista(provinciaId).subscribe(
      data => {
        this.localidades = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  editarPersonaDb() {
    this.personaService.update(this.personaId, this.formPerso.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getPersona();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  editarPersona() {
    this.editPerso = true;
    this.openModal(this.perso);
    this.getEditPersona();
  }

  editarAvatar() {
    this.editAvatar = true;
    this.editPerso = false;
    this.openModal(this.perso);
    this.getEditPersona();
  }

  getEditPersona() {
    this.personaService.getPersona(this.personaId)
      .pipe(first())
      .subscribe(x => this.formPerso.patchValue(x));
  }

  editarBanner(){
    this.editAvatar = false;
    this.editPerso = false;
    this.openModal(this.perso);
    this.getEditPersona();
  }

  editarAvatarDb() {
    this.personaService.update(this.personaId, this.formPerso.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getPersona();
        },
        error: err => {
          console.log(err);
        }
      });
      this.modalService.dismissAll();
  }

  get nombre() {
    return this.formPerso.get("nombre");
  }

  get apellido() {
    return this.formPerso.get("apellido");
  }

  get fecha_nacimiento() {
    return this.formPerso.get("fecha_nacimiento");
  }

  get telefono() {
    return this.formPerso.get("telefono");
  }

  get titulo() {
    return this.formPerso.get("titulo");
  }

  get provincia() {
    return this.formPerso.get("provincia");
  }

  get localidad() {
    return this.formPerso.get("localidad");
  }

  get acerca_de() {
    return this.formPerso.get("acerca_de");
  }


}
