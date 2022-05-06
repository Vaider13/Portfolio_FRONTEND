import { Proyecto } from './../../models/interfaces/proyecto';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { TokenService } from 'src/app/service/token.service';
import { SubirImagenesService } from 'src/app/service/subir-imagenes.service';
import { ProyectoImagenService } from 'src/app/service/proyecto-imagen.service';
import { ProyectoImagen } from 'src/app/models/interfaces/proyecto-imagen';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  proyectos: Proyecto[] = [];
  proyectosImg: ProyectoImagen[] = [];
  imagenes: any[] = []; //Variable de subida de las imagenes en el servidor
  //Se toma la variable guardada localmente con el ID
  //asociada a la persona para cargar y manipular los datos
  personaId: number = 1;
  proyectoId: number;
  formProyect: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar un proyecto.
  @ViewChild('proyecto') proyectModal: ElementRef;
  @ViewChild('delete') borrar: ElementRef;
  isLogged: boolean = false;
  //ReGex que verifica si se ingreso una URL valida.
  urlReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  //Configuraciones del modal.
  options: NgbModalOptions = {
    animation: true,
    scrollable: true,
    centered: true,
    backdrop: 'static'
  }


  constructor(private proyectoService: ProyectoService,
    private modalService: NgbModal,
    private tokenService: TokenService,
    private subImg: SubirImagenesService,
    private proyectImageService: ProyectoImagenService,
    private formBuilder: FormBuilder) {
    //Creacion del formulario reactivo para el componente Proyecto.
    this.formProyect = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fecha: ['', [Validators.required, this.validarFechaActual]],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(180)]],
      urlProyecto: ['', [Validators.required, Validators.pattern(this.urlReg)]],
      urlProyectoGitHub: ['', [Validators.pattern(this.urlReg)]]
    })
  }

  ngOnInit(): void {
    //Se carga la lista de proyectos y de imagenes.
    this.cargarProyectos();
    this.isLogged = this.tokenService.isLogged();
    this.cargarImagenes();
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

  //Carga las imagenes de los proyectos
  cargarImagenes(): void {
    this.proyectImageService.lista().subscribe(
      data => {
        this.proyectosImg = data;
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
      this.crearProyecto();
    } else {
      this.editarProyectoDb();
    }
  }

  //Crear un proyecto en la base de datos.
  crearProyecto(): void {
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
  editarProyectoDb(): void {
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
  editarProyecto(proyecto: Proyecto): void {
    this.isAdd = false;
    this.openModal(this.proyectModal);
    this.proyectoService.getById(proyecto.id)
      .pipe(first())
      .subscribe(x => this.formProyect.patchValue(x));
    this.proyectoId = proyecto.id;
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd(): void {
    this.isAdd = true;
    this.formProyect.reset();
    this.openModal(this.proyectModal);
  }

  //Toma la entidad del componente "proyecto-item" y abre el modal para confirmar su eliminacion.
  deleteProyecto(): void {
    this.openModalDelete(this.borrar);
  }

  //Borra las imagenes asociadas al proyecto.
  DeleteImgById(): void {
    this.proyectImageService.listaProyectoId(this.proyectoId).subscribe(
      data => {
        for (let i = 0; i < data.length; i++) {
          this.subImg.borrarImagen(data[i].imagenUrl);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  //Borra el proyecto de la base de datos
  deleteProyectoDb(): void {
    this.DeleteImgById();
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

  //Toma la entidad "proyecto" que envia el componente "proyecto-item"
  //Abre el cuadro para agregar una imagen, y
  //guarda el ID del proyecto para saber a que proyecto pertenece la imagen.
  onUploadImagen(proyecto: Proyecto): void {
    this.proyectoId = proyecto.id;
    document.getElementById("inputFileProyecto")?.click();
  }

  //convierte la imagen a base 64 y la sube al servidor firebase,
  //y posteriormente guarda la URL de la imagen en la base de datos.
  cargarImagenProyecto(event: any): void {
    let archivo = event.target.files;
    let nombre = "proyecto";
    let reader = new FileReader();
    reader.readAsDataURL(archivo[0]);
    reader.onloadend = () => {
      this.imagenes.push(reader.result);
      this.subImg.subirImagen(nombre + "_" + Date.now(), reader.result).then(urlImagen => {
        let proyectImg: ProyectoImagen = {
          imagenUrl: urlImagen!
        }
        this.subirImagen(proyectImg);
      });
    }
  }

  //Carga la URL de la imagen en la base de datos.
  subirImagen(proyectoImagen: ProyectoImagen): void {
    this.proyectImageService.save(proyectoImagen, this.proyectoId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarImagenes();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Funcion que abre el Modal con el formulario para editar o añadir un proyecto.
  openModal(content: any): void {
    this.modalService.open(content, this.options)
  }

  //Funcion que abre el Modal para confirmar la eliminacion del proyecto.
  openModalDelete(content: any): void {
    this.modalService.open(content, this.options)
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

  get urlProyectoGitHub() {
    return this.formProyect.get("urlProyectoGitHub");
  }

}
