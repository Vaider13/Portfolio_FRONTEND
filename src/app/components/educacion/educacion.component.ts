import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { Educacion } from 'src/app/models/interfaces/educacion';
import { EstadoEducacion } from 'src/app/models/interfaces/estado-educacion';
import { GradoEducacion } from 'src/app/models/interfaces/grado-educacion';
import { EducacionService } from 'src/app/service/educacion.service';
import { EstadoEducacionService } from 'src/app/service/estado-educacion.service';
import { GradoEducacionService } from 'src/app/service/grado-educacion.service';
import { SubirImagenesService } from 'src/app/service/subir-imagenes.service';
import { TokenService } from 'src/app/service/token.service';


@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {
  imagenes: any[] = []; //Variable de carga de las imagenes
  educaciones: Educacion[] = [];
  isUploading: boolean = false; //Variable que determina cuando la imgen se esta subiendo
  cancelImgUrl: string = "";
  ImgUrl: string;
  deleteImgUrl: string;
  personaId: number = 1;
  urlLogo: string;
  uploadImg: boolean = false; //Variable para mostrar la preview de la carga de una imagen
  eduId: number;
  formEdu: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar un estudio.
  gradosEducacion: GradoEducacion[] = [];
  estadosEducacion: EstadoEducacion[] = [];
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

  constructor(private educacionService: EducacionService,
    private subImg: SubirImagenesService,
    private modalService: NgbModal,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private gradoService: GradoEducacionService,
    private estadoService: EstadoEducacionService) {
    //Creacion del formulario reactivo para el componente educacion.
    this.formEdu = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      nombreInstitucion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required, this.validarFechaActual]],
      fechaFinal: ['', [Validators.required, this.validarFechaActual]],
      gradoEducacion: ['', [Validators.required]],
      estadoEducacion: ['', [Validators.required]],
      logoEducacion: ['']
    }, { validators: this.validarFechas });
  }

  ngOnInit(): void {
    //Se carga la lista de estudios, y estado y grado para el formulario
    this.cargarEducaciones();
    this.getGrado();
    this.getEstado();
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

  //Cuando se acepta el formulario si "isAdd"
  //es verdadero se llama a la funcion crear, y si es falso se llama a la funcion editar.
  onSubmit(): void {
    this.cancelImgUrl = "";
    if (this.isAdd) {
      this.uploadImg = false;
      this.crearEducacion();
    } else {
      this.editarEducacionDb();
    }
    this.imagenes = [];
  }

  //Obtiene el grado de estudio para cargarlos en el formulario.
  getGrado(): void {
    this.gradoService.lista().subscribe(
      data => {
        this.gradosEducacion = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Obtiene el estado de estudio para cargarlos en el formulario.
  getEstado(): void {
    this.estadoService.lista().subscribe(
      data => {
        this.estadosEducacion = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Crear un estudio en la base de datos.
  crearEducacion(): void {
    this.educacionService.save(this.formEdu.value, this.personaId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarEducaciones();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Edita un estudio en la base de datos.
  editarEducacionDb(): void {
    if (this.deleteImgUrl != "" && this.deleteImgUrl != undefined) {
      this.subImg.borrarImagen(this.deleteImgUrl);
      this.deleteImgUrl = "";
    }
    this.educacionService.update(this.eduId, this.formEdu.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarEducaciones();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Toma la entidad "Educacion" que envia el componente "Educacion-item"
  //Abre el Modal con el formulario, carga la entidad en el mismo para ser editada y guarda su ID.
  editarEducacion(educacion: Educacion): void {
    this.isAdd = false;
    this.uploadImg = false;
    this.formEdu.reset();
    this.educacionService.getById(educacion.id)
      .pipe(first())
      .subscribe(x => this.formEdu.patchValue(x));
    this.enCurso();
    this.eduId = educacion.id;
    this.ImgUrl = educacion.logoEducacion
    this.urlLogo = educacion.logoEducacion;
    setTimeout(() => { this.enCurso();this.openModal(this.content) }, 300);
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd(): void {
    this.isAdd = true;
    this.formEdu.reset();
    this.openModal(this.content);
    this.enCurso();
  }

  //Toma la entidad del componente "educacion-item" y abre el modal para confirmar su eliminacion.
  deleteEducacion(): void {
    this.openModalDelete(this.borrar);
  }

  //Borra el estudio de la base de datos
  deleteEducacionDb(): void {
    if (this.ImgUrl != "" && this.ImgUrl != null) {
      this.subImg.borrarImagen(this.ImgUrl);
    }
    this.educacionService.delete(this.eduId)
      .subscribe(
        () => {
          this.educaciones = this.educaciones.filter(t => t.id !== this.eduId);
          this.modalService.dismissAll();
        },
        err => {
          console.log(err);
        });
  }

  //Carga los estudios de la base de datos.
  cargarEducaciones(): void {
    this.educacionService.lista(this.personaId).subscribe(
      data => {
        this.educaciones = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Funcion que abre el Modal con el formulario para editar o añadir un estudio.
  openModal(content: any): void {
    this.modalService.open(content, this.options);
  }

  //Funcion que abre el Modal para confirmar la eliminacion del estudio.
  openModalDelete(content: any): void {
    this.modalService.open(content, this.options);
  }


  //Si el estado del estudio es "en curso", se deshabilita el input de fecha final y se resetea su valor.
  //En caso de no serlo, se rehabilita el input de fecha final.
  enCurso(): void {
    if (this.formEdu.get("estadoEducacion")?.value === "En Curso") {
      this.formEdu.get("fechaFinal")?.disable();
      this.formEdu.get("fechaFinal")?.reset();
    } else {
      this.formEdu.get("fechaFinal")?.enable();
    }
  }

  //convierte la imagen a base 64 y la sube al servidor firebase,
  //posteriormente guarda la URL de la imagen en la base de datos.
  cargarImagenLogoInstitucion(event: any): void {
    let archivo = event.target.files;
    let nombre = "logoEducacion";
    let reader = new FileReader();
    reader.readAsDataURL(archivo[0]);
    reader.onloadend = () => {
      this.imagenes.push(reader.result);
      this.uploadImg = true;
      this.isUploading = true;
      this.deleteImgUrl = this.urlLogo;
      this.urlLogo = null!;
      this.subImg.subirImagen(nombre + "_" + Date.now(), reader.result).then(urlImagen => {
        this.cancelImgUrl = urlImagen!;
        this.formEdu.patchValue({
          logoEducacion: urlImagen
        });
        this.isUploading = false;
      });
    }
  }

  cancel(): void{
    if (this.cancelImgUrl != "" && this.cancelImgUrl != undefined) {
      this.subImg.borrarImagen(this.cancelImgUrl);
      this.cancelImgUrl = "";
      this.uploadImg = false;
    }
  }

  //Borra la URL almacenada de una imagen.
  borrarImagen(): void {
    this.deleteImgUrl = this.ImgUrl;
    this.formEdu.patchValue({
      logoEducacion: ""
    });
    this.urlLogo = "";
  }

  //Getters del formulario reactivo.
  get titulo() {
    return this.formEdu.get("titulo");
  }

  get nombreInstitucion() {
    return this.formEdu.get("nombreInstitucion");
  }

  get fechaInicio() {
    return this.formEdu.get("fechaInicio");
  }

  get fechaFinal() {
    return this.formEdu.get("fechaFinal");
  }

  get logoEducacion() {
    return this.formEdu.get("logoEducacion");
  }

  get gradoEducacion() {
    return this.formEdu.get("gradoEducacion");
  }

  get estadoEducacion() {
    return this.formEdu.get("estadoEducacion");
  }

}
