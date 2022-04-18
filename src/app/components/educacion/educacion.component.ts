import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { Educacion } from 'src/app/models/interfaces/educacion';
import { EstadoEducacion } from 'src/app/models/interfaces/estado-educacion';
import { GradoEducacion } from 'src/app/models/interfaces/grado-educacion';
import { EducacionService } from 'src/app/service/educacion.service';
import { EstadoEducacionService } from 'src/app/service/estado-educacion.service';
import { GradoEducacionService } from 'src/app/service/grado-educacion.service';
import { TokenService } from 'src/app/service/token.service';



@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {

  educaciones: Educacion[] = [];
  //Se toma la variable guardada localmente con el ID
  //asociada a la persona para cargar y manipular los datos
  personaId: number = 1; //parseInt(localStorage.getItem('personaId')!);
  @Input() educacion: Educacion;
  urlLogo: string;
  urlReg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  eduId: number;
  formEdu: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar un estudio.
  gradoEducacion: GradoEducacion[] = [];
  estadoEducacion: EstadoEducacion[] = [];
  @ViewChild('content') content: ElementRef;
  @ViewChild('delete') borrar: ElementRef;
  isLogged: boolean = false;

  constructor(private educacionService: EducacionService,
    private modalService: NgbModal,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private gradoService: GradoEducacionService,
    private estadoService: EstadoEducacionService) {
    //Creacion del formulario reactivo para el componente educacion.
    this.formEdu = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      nombreInstitucion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFinal: [''],
      gradoEducacion: ['', [Validators.required]],
      estadoEducacion: ['', [Validators.required]],
      logoEducacion: ['', [Validators.pattern(this.urlReg)]]
    })
  }

  ngOnInit(): void {
    //Se carga la lista de estudios, y estado y grado para el formulario
    this.cargarEducaciones();
    this.getGrado();
    this.getEstado();
    this.isLogged = this.tokenService.isLogged()
  }

  //Cuando se acepta el formulario si "isAdd"
  //es verdadero se llama a la funcion crear, y si es falso se llama a la funcion editar.
  onSubmit() {
    if (this.isAdd) {
      this.crearEducacion();
    } else {
      this.editarEducacionDb();
    }
    this.modalService.dismissAll(); //Se descarta el modal
  }

  //Obtiene el grado de estudio para cargarlos en el formulario.
  getGrado() {
    this.gradoService.lista().subscribe(
      data => {
        this.gradoEducacion = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Obtiene el estado de estudio para cargarlos en el formulario.
  getEstado() {
    this.estadoService.lista().subscribe(
      data => {
        this.estadoEducacion = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Crear un estudio en la base de datos.
  crearEducacion() {
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
  editarEducacionDb() {
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
  editarEducacion(educacion: Educacion) {
    this.isAdd = false;
    this.openModal(this.content);
    this.educacionService.getById(educacion.id)
      .pipe(first())
      .subscribe(x => this.formEdu.patchValue(x));
    this.eduId = educacion.id;
    this.urlLogo = educacion.logoEducacion;
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd() {
    this.isAdd = true;
    this.formEdu.reset();
    this.openModal(this.content);
  }

  //Toma la entidad del componente "educacion-item" y abre el modal para confirmar su eliminacion.
  deleteEducacion() {
    this.modalService.dismissAll()
    this.openModalDelete(this.borrar);
  }

  //Borra el estudio de la base de datos
  deleteEducacionDb() {
    this.educacionService.delete(this.eduId)
      .subscribe(
        () => {
          this.educaciones = this.educaciones.filter(t => t.id !== this.eduId)
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
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'educacionModal' })
  }

  //Funcion que abre el Modal para confirmar la eliminacion del estudio.
  openModalDelete(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-delete' })
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
    return this.formEdu.get("fechaFinal");
  }

}
