import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ExperienciaLaboral } from 'src/app/models/interfaces/experiencialaboral';
import { ExperiencialaboralService } from 'src/app/service/experiencialaboral.service';
import { SubirImagenesService } from 'src/app/service/subir-imagenes.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css']
})
export class ExperienciaLaboralComponent implements OnInit {

  trabajos: ExperienciaLaboral[] = [];
  imagenes: any[] = []; //Variable de carga de las imagenes
  isUploading: boolean = false; //Variable que determina cuando la imgen se esta subiendo
  personaId: number = 1;
  trabajoId: number;
  urlLogo: string;
  uploadImg: boolean = false; //Variable para mostrar la preview de la carga de una imagen
  formExp: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar un trabajo.
  @ViewChild('content') content: ElementRef;
  @ViewChild('delete') borrar: ElementRef;
  isLogged: boolean = false;
  //Configuraciones del modal.
  options: NgbModalOptions = {
    animation: true,
    scrollable: true,
    centered: true,
    backdrop: 'static'
  }



  constructor(private trabajoService: ExperiencialaboralService,
    private subImg: SubirImagenesService,
    private tokenService: TokenService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {
    //Creacion del formulario reactivo para el componente Experiencia Laboral.
    this.formExp = this.formBuilder.group({
      nombreEmpresa: ['', [Validators.required]],
      puesto: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required, this.validarFechaActual]],
      fechaFinal: ['', [Validators.required, this.validarFechaActual]],
      enCurso: [''],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(180)]],
      logoEmpresa: ['']
    }, { validators: this.validarFechas })
  }
  ngOnInit(): void {
    //Se carga la lista de trabajos para el formulario
    this.cargarTrabajos();
    this.isLogged = this.tokenService.isLogged()
  }

  //Valida que la fecha no supere la fecha actual en el formulario.
  validarFechaActual: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    const today = new Date();
    return date < today ? null : { fechaValida: true };
  }

  //Valida si la fecha de inicio es mayor que la final.
  validarFechas: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const inicial = control.get('fechaInicio');
    const final = control.get('fechaFinal');
    if (inicial?.value !== null && final?.value === null) {
      return null;
    };
    return inicial?.value !== null && final?.value !== null && inicial?.value <= final?.value ? null : { fechasValidas: true };
  }

  //Carga los trabajos de la base de datos.
  cargarTrabajos(): void {
    this.trabajoService.lista(this.personaId).subscribe(
      data => {
        this.trabajos = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Cuando se acepta el formulario si "isAdd"
  //es verdadero se llama a la funcion crear, y si es falso se llama a la funcion editar.
  onSubmit(): void {
    if (this.isAdd) {
      this.crearTrabajo();
    } else {
      this.editarTrabajoDb();
    }
  }

  //Crear un trabajo en la base de datos.
  crearTrabajo(): void {
    this.trabajoService.save(this.formExp.value, this.personaId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarTrabajos();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Edita un trabajo en la base de datos.
  editarTrabajoDb(): void {
    this.trabajoService.update(this.trabajoId, this.formExp.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarTrabajos();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Toma la entidad "ExperienciaLaboral" que envia el componente "ExperienciaLaboral-item"
  //Abre el Modal con el formulario, carga la entidad en el mismo para ser editada y guarda su ID.
  editarTrabajo(trabajo: ExperienciaLaboral): void {
    this.isAdd = false;
    this.uploadImg = false;
    this.openModal(this.content);
    this.trabajoService.getById(trabajo.id)
      .pipe(first())
      .subscribe(x => this.formExp.patchValue(x));
    this.trabajoId = trabajo.id;
    this.urlLogo = trabajo.logoEmpresa;
    setTimeout(() => { this.trabajando() }, 25);
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd(): void {
    this.isAdd = true;
    this.formExp.reset();
    this.trabajando();
    this.openModal(this.content);
  }

  //Toma la entidad del componente "ExperienciaLaboral-item" y abre el modal para confirmar su eliminacion.
  deleteTrabajo(): void {
    this.openModalDelete(this.borrar);
  }

  //Borra el trabajo de la base de datos
  deleteTrabajoDb(): void {
    this.trabajoService.delete(this.trabajoId)
      .subscribe(
        () => {
          this.trabajos = this.trabajos.filter(t => t.id !== this.trabajoId)
          this.modalService.dismissAll();
        },
        err => {
          console.log(err);
        });
  }

  //Si se selecciona que actualmente se esta trabajando, desactiva el input de la fecha final y resetea el mismo.
  //Caso contrario vuelve a habilitar el inpout de fecha final.
  trabajando(): void {
    if (this.formExp.get('enCurso')?.value === true) {
      this.formExp.get('fechaFinal')?.reset();
      this.formExp.get('fechaFinal')?.disable();
    } else {
      this.formExp.get('fechaFinal')?.enable();
    }
  }

  //Funcion que abre el Modal con el formulario para editar o añadir un trabajo.
  openModal(content: any): void {
    this.modalService.open(content, this.options)
  }

  //Funcion que abre el Modal para confirmar la eliminacion del trabajo.
  openModalDelete(content: any): void {
    this.modalService.open(content, this.options)
  }

  //convierte la imagen a base 64 y la sube al servidor firebase,
  //y posteriormente guarda la URL de la imagen en la base de datos.
  cargarImagen(event: any): void {
    let archivo = event.target.files;
    let nombre = "logoEmpresa";
    let reader = new FileReader();
    reader.readAsDataURL(archivo[0]);
    reader.onloadend = () => {
      this.imagenes.push(reader.result);
      this.uploadImg = true;
      this.isUploading = true;
      this.urlLogo = null!;
      this.subImg.subirImagen(nombre + "_" + Date.now(), reader.result).then(urlImagen => {
        this.formExp.patchValue({
          logoEmpresa: urlImagen
        });
        this.isUploading = false;
      });
    }
  }

  //Borra la URL almacenada de una imagen.
  borrarImagen(): void {
    this.formExp.patchValue({
      logoEducacion: ""
    });
    this.urlLogo = "";
  }

  //Getters del formulario reactivo.
  get nombreEmpresa() {
    return this.formExp.get("nombreEmpresa");
  }

  get puesto() {
    return this.formExp.get("puesto");
  }

  get fechaInicio() {
    return this.formExp.get("fechaInicio");
  }

  get fechaFinal() {
    return this.formExp.get("fechaFinal");
  }

  get descripcion() {
    return this.formExp.get("descripcion");
  }

  get logoEmpresa() {
    return this.formExp.get("logoEmpresa");
  }

  get enCurso() {
    return this.formExp.get("enCurso");
  }
}
