import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Provincia } from 'src/app/models/interfaces/provincia';
import { PersonaDto } from 'src/app/models/interfaces/persona-dto';
import { PersonaService } from 'src/app/service/persona.service';
import { Localidad } from 'src/app/models/interfaces/localidad';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
  deleteImg: boolean = false;
  personaDto: PersonaDto;
  editAvatar: boolean = false; //Variable que determina si se va a editar la imagen del Avatar.
  editPerso: boolean = false; //Variable que determina si se va a editar los datos de la persona.
  formPerso: FormGroup;
  formLocalidad: FormGroup;
  localidades: Localidad[] = [];
  provincias: Provincia[] = [];
  @ViewChild('persona') perso: ElementRef;
  @ViewChild('local') crearLocalidad: ElementRef;
  isLogged: boolean = false;
  //Configuraciones del modal.
  options: NgbModalOptions = {
    animation: true,
    scrollable:true,
    centered: true,
    backdrop: 'static'
  }

  constructor(private personaService: PersonaService,
    private modalService: NgbModal,
    private subImg: SubirImagenesService,
    private tokenService: TokenService,
    private provinciaService: ProvinciaService,
    private localidadService: LocalidadService,
    private formBuilder: FormBuilder,) {
    //Creacion del formulario reactivo para modificar los datos de una persona.
    this.formPerso = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required, , this.validarFechaActual]],
      titulo: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.maxLength(10), Validators.minLength(8)]],
      provincia: ['', [Validators.required]],
      localidad: ['', [Validators.required]],
      acerca_de: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(180)]],
      urlAvatar: [''],
      urlBanner: [''],
    }),
      //Creacion del formulario reactivo para agregar una nueva localidad.
      this.formLocalidad = this.formBuilder.group({
        provincia: ['', [Validators.required]],
        localidad: ['', [Validators.required]],
      })
  }

  //Obtiene los datos de la persona para mostrarlos en el template
  ngOnInit(): void {
    this.getPersona();
    this.isLogged = this.tokenService.isLogged()
  }

  //Cuando se selecciona una provincia carga los localidades pertenecientes a la misma.
  seleccionarProvincia(provincia: string): void {
    console.log(provincia);
    this.provinciaService.getProvincia(provincia).subscribe(
      data => {
        console.log(data.id);
        this.getLocalidades(data.id);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Valida que la fecha no supere la fecha actual en el formulario.
  validarFechaActual: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    const today = new Date();
    return date < today ? null : { fechaValida: true };
  }

  //Abre el modal para modificar los datos de una persona.
  openModal(content: any): void {
    this.modalService.open(content,this.options )
  }
  //Abre el modal para agregar una nueva localidad.
  openModalLocalidad(content: any): void {
    this.modalService.open(content, this.options)
  }

  //Se guardan los cambios en la base de datos.
  onSubmit(): void {
    this.editarPersonaDb();
    this.uploadImg = false;
  }

  //Calcula la edad de la persona en base a su fecha de nacimiento, para asi poder mostrarla en el template.
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

  //Se obtienen los datos de la persona.
  getPersona(): void  {
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

  //Se obtiene la lista de las provincias.
  getProvincias(): void  {
    this.provinciaService.lista().subscribe(
      data => {
        this.provincias = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Se obtienen las localidades de una provincia por medio del ID de la misma.
  getLocalidades(provinciaId: number): void  {
    this.localidadService.lista(provinciaId).subscribe(
      data => {
        this.localidades = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Guarda los cambios en la base de datos.
  editarPersonaDb(): void  {
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

  //Cuando se hace click en editar los datos de una persona. Se obtienen las provincias y localidades de las mismas,
  // para poder cargarlas en el formulario, se indica que se esta editando una persona, se abre el modal con el formulario,
  //y se llama a la funcion para cargar los datos en el formulario para su posterior edicion.
  editarPersona(): void  {
    this.getProvincias();
    this.getLocalidades(this.personaDto.provinciaId);
    this.editPerso = true;
    this.openModal(this.perso);
    this.getEditPersona();
  }

  //Si se va a editar el Avatar la variable cambia a true, se indica que no se va a borrar una imagen,
  //ni a editar toda la persona, solo su avatar, se abre el modal y se cargan los datos en el mismo para su edicion.
  editarAvatar(): void  {
    this.editAvatar = true;
    this.deleteImg = false;
    this.editPerso = false;
    this.openModal(this.perso);
    this.getEditPersona();
  }

  //Obtiene los datos de la persona y los carga en el formulario para su posterior edicion.
  getEditPersona(): void  {
    this.personaService.getPersona(this.personaId)
      .pipe(first())
      .subscribe(x => this.formPerso.patchValue(x));
  }

  //Si se va a editar el banner la variable "edit avatar" cambia a false, se indica que no se va a borrar una imagen,
  //ni a editar toda la persona, solo su avatar.
  editarBanner(): void  {
    this.editAvatar = false;
    this.deleteImg = false;
    this.editPerso = false;
    this.openModal(this.perso);
    this.getEditPersona();
  }

  //Cuando se hace click en agregar nueva localidad abre el modal para agregar una localidad, y lo resetea.
  nuevaLocalidad(): void  {
    this.openModalLocalidad(this.crearLocalidad);
    this.formLocalidad.reset();
  }

  //Guarda una nueva localidad en la base de datos.
  guardarLocalidadDb(): void  {
    this.localidadService.save(this.formLocalidad.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.seleccionarProvincia(this.formLocalidad.get('provincia')?.value);
          this.formPerso.patchValue({
            provincia: this.formLocalidad.get('provincia')?.value,
            localidad: this.formLocalidad.get('localidad')?.value
          })
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //convierte la imagen a base 64 y la sube al servidor firebase,
  //posteriormente guarda la URL de la imagen en la base de datos.
  cargarImagen(event: any): void  {
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

  //Borra la URL almacenada de una imagen.
  borrarImagen(): void  {
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

  get prov() {
    return this.formLocalidad.get("provincia");
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
