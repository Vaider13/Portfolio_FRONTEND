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
import { TokenService } from 'src/app/service/token.service';
import { SubirImagenesService } from 'src/app/service/subir-imagenes.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css'],
})
export class EncabezadoComponent implements OnInit {
  personaId: number = 1;
  edad: number;
  imagenes: any[] = []; //Variable de carga de las imagenes
  isUploading: boolean = false; //Variable que determina cuando la imgen se esta subiendo
  uploadImg: boolean = false; //Variable para mostrar la preview de la carga de una imagen
  deleteImg:boolean = false;
  personaDto: PersonaDto;
  editAvatar: boolean = false;
  editPerso: boolean = false;
  formPerso: FormGroup;
  localidades: Localidad[] = [];
  provincias: Provincia[] = [];
  provinciaId: number;
  @ViewChild('persona') perso: ElementRef;
  isLogged: boolean = false;

  constructor(private personaService: PersonaService,
    private modalService: NgbModal,
    private subImg: SubirImagenesService,
    private tokenService: TokenService,
    private provinciaService: ProvinciaService,
    private localidadService: LocalidadService,
    private formBuilder: FormBuilder,) {
    this.formPerso = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.maxLength(10), Validators.minLength(8)]],
      provincia: ['', [Validators.required]],
      localidad: ['', [Validators.required]],
      acerca_de: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(180)]],
      urlAvatar: [''],
      urlBanner: [''],
    })
  }

  ngOnInit(): void {
    this.getPersona();
    this.getProvincias();
    this.getLocalidades(1);
    this.isLogged = this.tokenService.isLogged()
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'personaModal' })
  }

  onSubmit() {
    this.editarPersonaDb();
    this.uploadImg = false;
    this.modalService.dismissAll(); //Se descarta el modal
  }

  getEdad(dateString: string) {
    var hoy = new Date();
    var nacimiento = new Date(dateString);
    var edad = hoy.getFullYear() - nacimiento.getFullYear();
    var m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  getPersona() {
    this.personaService.getPersonaByUsuarioId((this.personaId)).subscribe(
      data => {
        this.personaDto = data;
        this.edad = this.getEdad(data.fecha_nacimiento);
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
    this.deleteImg = false;
    this.editPerso = false;
    this.openModal(this.perso);
    this.getEditPersona();
  }

  getEditPersona() {
    this.personaService.getPersona(this.personaId)
      .pipe(first())
      .subscribe(x => this.formPerso.patchValue(x));
  }

  editarBanner() {
    this.editAvatar = false;
    this.deleteImg = false;
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

  cargarImagen(event: any) {
    let archivo = event.target.files;
    let nombre = "logoEducacion";
    let reader = new FileReader();
    reader.readAsDataURL(archivo[0]);
    reader.onloadend = () => {
      this.imagenes.push(reader.result);
      this.uploadImg = true;
      this.isUploading = true;
      this.subImg.subirImagen(nombre + "_" + Date.now(), reader.result).then(urlImagen => {
        if (this.editAvatar) {
          this.formPerso.patchValue({
            urlAvatar: urlImagen
          });
        } else {
          this.formPerso.patchValue({
            urlBanner: urlImagen
          });
        }
        this.isUploading = false;
      });
    }
  }

  borrarImagen() {
    this.deleteImg = true;
    if (this.editAvatar) {
      this.formPerso.patchValue({
        urlAvatar: ""
      });
    } else {
      this.formPerso.patchValue({
        urlBanner: ""
      });
    }
  }

  //Getters del formulario reactivo.

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

  get urlAvatar() {
    return this.formPerso.get("urlAvatar");
  }

  get urlBanner() {
    return this.formPerso.get("urlBanner");
  }


}
