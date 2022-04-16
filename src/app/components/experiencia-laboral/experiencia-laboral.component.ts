import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ExperienciaLaboral } from 'src/app/models/interfaces/experiencialaboral';
import { ExperiencialaboralService } from 'src/app/service/experiencialaboral.service';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css']
})
export class ExperienciaLaboralComponent implements OnInit {

  trabajos: ExperienciaLaboral[] = [];
  //Se toma la variable guardada localmente con el ID
  //asociada a la persona para cargar y manipular los datos
  personaId: number = parseInt(localStorage.getItem('personaId')!);
  @Input() trabajo: ExperienciaLaboral;
  trabajoId: number;
  urlReg  = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  urlLogo: string;
  formExp: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar un trabajo.
  @ViewChild('content') content: ElementRef;
  @ViewChild('delete') borrar: ElementRef;



  constructor(private trabajoService: ExperiencialaboralService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {
    //Creacion del formulario reactivo para el componente Experiencia Laboral.
    this.formExp = this.formBuilder.group({
      nombreEmpresa: ['', [Validators.required]],
      puesto: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFinal: [''],
      descripcion: ['', [Validators.required]],
      logoEmpresa:['',[Validators.pattern(this.urlReg)]]
    })
  }
  ngOnInit(): void {
    //Se carga la lista de trabajos para el formulario
    this.cargarTrabajos();
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
  onSubmit() {
    if (this.isAdd) {
      this.crearTrabajo();
    } else {
      this.editarTrabajoDb();
    }
    this.modalService.dismissAll(); //Se descarta el modal
  }

  //Crear un trabajo en la base de datos.
  crearTrabajo() {
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
  editarTrabajoDb() {
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
  editarTrabajo(trabajo: ExperienciaLaboral) {
    this.isAdd = false;
    this.openModal(this.content);
    this.trabajoService.getById(trabajo.id)
      .pipe(first())
      .subscribe(x => this.formExp.patchValue(x));
    this.trabajoId = trabajo.id;
    this.urlLogo = trabajo.logoEmpresa;
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd() {
    this.isAdd = true;
    this.formExp.reset();
    this.openModal(this.content);
  }

  //Toma la entidad del componente "ExperienciaLaboral-item" y abre el modal para confirmar su eliminacion.
  deleteTrabajo(trabajo: ExperienciaLaboral) {
    this.trabajoId = trabajo.id;
    this.openModalDelete(this.borrar);
  }

  //Borra el trabajo de la base de datos
  deleteTrabajoDb() {
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

  //Funcion que abre el Modal con el formulario para editar o añadir un trabajo.
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'trabajoModal' })
  }

  //Funcion que abre el Modal para confirmar la eliminacion del trabajo.
  openModalDelete(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-delete' })
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
}
