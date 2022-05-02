import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ExperienciaIdioma } from 'src/app/models/interfaces/experiencia-idioma';
import { Idioma } from 'src/app/models/interfaces/idioma';
import { ExperienciaIdiomaService } from 'src/app/service/experiencia-idioma.service';
import { IdiomaService } from 'src/app/service/idioma.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-idioma',
  templateUrl: './idioma.component.html',
  styleUrls: ['./idioma.component.css']
})
export class IdiomaComponent implements OnInit {

  experienciaIdiomas: ExperienciaIdioma[] = [];
  idiomas: Idioma[] = [];
  //Se toma la variable guardada localmente con el ID
  //asociada a la persona para cargar y manipular los datos
  personaId: number = 1;
  experienciaIdiomaId: number;
  formExpIdioma: FormGroup;
  formIdioma: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar un idioma.
  @ViewChild('expIdioma') expIdioma: ElementRef;
  @ViewChild('idioma') idioma: ElementRef;
  @ViewChild('delete') borrar: ElementRef;
  isLogged: boolean = false;
  //Configuraciones del modal.
  options: NgbModalOptions = {
    animation: true,
    scrollable: true,
    centered: true,
    backdrop: 'static'
  }

  constructor(private exoerienciaIdiomaService: ExperienciaIdiomaService,
    private idiomaService: IdiomaService,
    private tokenService: TokenService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {
    //Creacion del formulario reactivo para el componente Idioma.
    this.formExpIdioma = this.formBuilder.group({
      nombreIdioma: ['', [Validators.required]],
      oral: ['', [Validators.required]],
      escritura: ['', [Validators.required]],
      lectura: ['', [Validators.required]]
    }),
    //Creacion del formulario reactivo para agregar un nuevo Idioma a la lista de idiomas.
      this.formIdioma = this.formBuilder.group({
        nombreIdioma: ['', [Validators.required, , this.validarSiElIdiomaExiste]]
      })
  }

  //valida si el idioma a agregar existe o no en la base de datos.
  validarSiElIdiomaExiste: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const idioma = control.value.toUpperCase();
    let exist:boolean = false;
    for(let i = 0; i < this.idiomas.length; i++) {
      if(this.idiomas[i].nombreIdioma.toUpperCase() == idioma) {
        exist = true;
      }
    }
    return !exist ? null : { existe: true };
  }

  ngOnInit(): void {
    //Se llama a la funcion para cargar la lista de idiomas y las experiencia en idiomas.
    this.cargarExperienciaIdiomas();
    this.cargarIdiomas();
    this.isLogged = this.tokenService.isLogged()
  }

  //Carga las experiencias en idiomas de la base de datos.
  cargarExperienciaIdiomas(): void {
    this.exoerienciaIdiomaService.lista(this.personaId).subscribe(
      data => {
        this.experienciaIdiomas = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Carga la lista de Idiomas usada en la lista de idiomas del formulario reactivo.
  cargarIdiomas(): void {
    this.idiomaService.lista().subscribe(
      data => {
        this.idiomas = data;
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
      this.crearExpIdioma();
    } else {
      this.editarExpIdiomaDb();
    }
  }

  //Crear una nueva ex`periencia en idiomas en la base de datos.
  crearExpIdioma(): void {
    this.exoerienciaIdiomaService.save(this.formExpIdioma.value, this.personaId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarExperienciaIdiomas();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Abre el formulario para agregar un nuevo idioma a la lista de idiomas.
  nuevaIdioma(): void {
    this.openModal(this.idioma);
    this.formIdioma.reset();
  }

  //Guarda un nuevo idioma de la lista de idiomas en la base de datos.
  guardarIdiomaDb(): void {
    this.idiomaService.save(this.formIdioma.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarIdiomas();
          this.formExpIdioma.patchValue({
            nombreIdioma: this.formIdioma.get('nombreIdioma')?.value
          })
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Edita un idioma en la base de datos.
  editarExpIdiomaDb(): void {
    this.exoerienciaIdiomaService.update(this.experienciaIdiomaId, this.formExpIdioma.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarExperienciaIdiomas();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Toma la entidad "skill" que envia el componente "skill-item"
  //Abre el Modal con el formulario, carga la entidad en el mismo para ser editada y guarda su ID.
  editarExpIdioma(experienciaIdioma: ExperienciaIdioma): void {
    this.isAdd = false;
    this.openModal(this.expIdioma);
    this.exoerienciaIdiomaService.getById(experienciaIdioma.id)
      .pipe(first())
      .subscribe(x => this.formExpIdioma.patchValue(x));
    this.experienciaIdiomaId = experienciaIdioma.id;
    alert(this.experienciaIdiomaId);
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd(): void {
    this.isAdd = true;
    this.formExpIdioma.reset();
    this.openModal(this.expIdioma);
  }

  //Toma la entidad del componente "skill-item" y abre el modal para confirmar su eliminacion.
  deleteExpIdioma(): void {
    this.openModalDelete(this.borrar);
  }

  //Borra una skill de la base de datos
  deleteExpIdiomaDb(): void {
    this.exoerienciaIdiomaService.delete(this.experienciaIdiomaId)
      .subscribe(
        () => {
          this.experienciaIdiomas = this.experienciaIdiomas.filter(t => t.id !== this.experienciaIdiomaId);
          this.modalService.dismissAll();
        },
        err => {
          console.log(err);
        });
  }

  //Funcion que abre el Modal con el formulario para editar o añadir una skill.
  openModal(content: any): void {
    this.modalService.open(content, this.options)
  }

  //Funcion que abre el Modal para confirmar la eliminacion del proyecto.
  openModalDelete(content: any): void {
    this.modalService.open(content, this.options)
  }

  //Getters del formulario reactivo.
  get nombreIdioma() {
    return this.formExpIdioma.get("nombreIdioma");
  }

  get oral() {
    return this.formExpIdioma.get("oral");
  }

  get escritura() {
    return this.formExpIdioma.get("escritura");
  }

  get lectura() {
    return this.formExpIdioma.get("lectura");
  }



}
