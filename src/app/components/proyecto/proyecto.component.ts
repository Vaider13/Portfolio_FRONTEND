import { Proyecto } from './../../models/interfaces/proyecto';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  proyectos: Proyecto[] = [];
  //Se toma la variable guardada localmente con el ID
  //asociada a la persona para cargar y manipular los datos
  personaId: number = 1;
  @Input() proyecto: Proyecto;
  proyectoId: number;
  formProyect: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar un proyecto.
  @ViewChild('proyecto') proyectModal: ElementRef;
  @ViewChild('delete') borrar: ElementRef;
  isLogged: boolean = false;
  urlReg  = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  constructor(private proyectoService: ProyectoService,
    private modalService: NgbModal,
    private tokenService: TokenService,
    private formBuilder: FormBuilder) {
    //Creacion del formulario reactivo para el componente Proyecto.
    this.formProyect = this.formBuilder.group({
      nombre: ['', [Validators.required, this.validarFechaActual]],
      fecha: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(180)]],
      urlProyecto:  ['', [Validators.pattern(this.urlReg)]]
    })
  }

  ngOnInit(): void {
    //Se carga la lista de proyectos para el formulario
    this.cargarProyectos();
    this.isLogged = this.tokenService.isLogged()
  }

   //Valida que la fecha no supere la fecha actual en el formulario.
   validarFechaActual: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    const today = new Date();
    return date < today ? null : { fechaValida: true };
  }

  //Carga los proyectos de la base de datos.
  cargarProyectos(): void {
    this.proyectoService.lista(this.personaId).subscribe(
      data => {
        this.proyectos = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Cuando se acepta el formulario si "isAdd"
  //es verdadero se llama a la funcion crear, y si es falso se llama a la funcion editar.
  onSubmit() {
    if (this.isAdd) {
      this.crearProyecto();
    } else {
      this.editarProyectoDb();
    }
  }

  //Crear un proyecto en la base de datos.
  crearProyecto() {
    this.proyectoService.save(this.formProyect.value, this.personaId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarProyectos();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Edita un proyecto en la base de datos.
  editarProyectoDb() {
    this.proyectoService.update(this.proyectoId, this.formProyect.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarProyectos();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Toma la entidad "proyecto" que envia el componente "proyecto-item"
  //Abre el Modal con el formulario, carga la entidad en el mismo para ser editada y guarda su ID.
  editarProyecto(proyecto: Proyecto) {
    this.isAdd = false;
    this.openModal(this.proyectModal);
    this.proyectoService.getById(proyecto.id)
      .pipe(first())
      .subscribe(x => this.formProyect.patchValue(x));
    this.proyectoId = proyecto.id;
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd() {
    this.isAdd = true;
    this.formProyect.reset();
    this.openModal(this.proyectModal);
  }

  //Toma la entidad del componente "proyecto-item" y abre el modal para confirmar su eliminacion.
  deleteProyecto() {
    this.openModalDelete(this.borrar);
  }

  //Borra el proyecto de la base de datos
  deleteProyectoDb() {
    this.proyectoService.delete(this.proyectoId)
      .subscribe(
        () => {
          this.proyectos = this.proyectos.filter(t => t.id !== this.proyectoId)
          this.modalService.dismissAll();
        },
        err => {
          console.log(err);
        });
  }

  //Funcion que abre el Modal con el formulario para editar o añadir un proyecto.
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'proyectModal' })
  }

  //Funcion que abre el Modal para confirmar la eliminacion del proyecto.
  openModalDelete(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-delete' })
  }

  //Getters del formulario reactivo.
  get nombre() {
    return this.formProyect.get("nombre");
  }

  get fecha() {
    return this.formProyect.get("fecha");
  }

  get descripcion() {
    return this.formProyect.get("descripcion");
  }

  get urlProyecto() {
    return this.formProyect.get("urlProyecto");
  }

}
