import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { Skill } from 'src/app/models/interfaces/skill';
import { SkillService } from 'src/app/service/skill.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  skills: Skill[] = [];
  //Se toma la variable guardada localmente con el ID
  //asociada a la persona para cargar y manipular los datos
  personaId: number = 1;
  skillId: number;
  formSkill: FormGroup;
  isAdd: boolean = true; //Variable para determinar si el usuario va a crear o editar una skill.
  @ViewChild('skill') skillModal: ElementRef;
  @ViewChild('delete') borrar: ElementRef;
  isLogged: boolean = false;
   //Configuraciones del modal.
   options: NgbModalOptions = {
    animation: true,
    scrollable: true,
    centered: true,
    backdrop: 'static'
  }

  constructor(private skillService: SkillService,
    private tokenService: TokenService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {
    //Creacion del formulario reactivo para el componente Skill.
    this.formSkill = this.formBuilder.group({
      nombreSkill: ['', [Validators.required]],
      tipoSkill: ['', [Validators.required]],
      nivelSkill: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    })
  }

  ngOnInit(): void {
    //Se llama a la funcion para cargar la lista de skills.
    this.cargarSkills();
    this.isLogged = this.tokenService.isLogged()
  }

  //Carga las skill de la base de datos.
  cargarSkills(): void {
    this.skillService.lista(this.personaId).subscribe(
      data => {
        this.skills = data;
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
      this.crearSkill();
    } else {
      this.editarSkillDb();
    }
  }

  //Crear una skill en la base de datos.
  crearSkill(): void  {
    this.skillService.save(this.formSkill.value, this.personaId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarSkills();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Edita una skill en la base de datos.
  editarSkillDb(): void  {
    this.skillService.update(this.skillId, this.formSkill.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarSkills();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Toma la entidad "skill" que envia el componente "skill-item"
  //Abre el Modal con el formulario, carga la entidad en el mismo para ser editada y guarda su ID.
  editarSkill(skill: Skill): void  {
    this.isAdd = false;
    this.openModal(this.skillModal);
    this.skillService.getById(skill.id)
      .pipe(first())
      .subscribe(x => this.formSkill.patchValue(x));
    this.skillId = skill.id;
  }

  //Cuando se aprieta el boton de Agregar, resetea el formulario y carga el Modal del mismo.
  onAdd(): void  {
    this.isAdd = true;
    this.formSkill.reset();
    this.openModal(this.skillModal);
  }

  //Toma la entidad del componente "skill-item" y abre el modal para confirmar su eliminacion.
  deleteSkill(): void  {
    this.openModalDelete(this.borrar);
  }

  //Borra una skill de la base de datos
  deleteSkillDb(): void  {
    this.skillService.delete(this.skillId)
      .subscribe(
        () => {
          this.skills = this.skills.filter(t => t.id !== this.skillId);
          this.modalService.dismissAll();
        },
        err => {
          console.log(err);
        });
  }

  //Funcion que abre el Modal con el formulario para editar o añadir una skill.
  openModal(content: any): void  {
    this.modalService.open(content, this.options)
  }

  //Funcion que abre el Modal para confirmar la eliminacion del proyecto.
  openModalDelete(content: any): void  {
    this.modalService.open(content, this.options)
  }

  //Getters del formulario reactivo.
  get nombreSkill() {
    return this.formSkill.get("nombreSkill");
  }

  get tipoSkill() {
    return this.formSkill.get("tipoSkill");
  }

  get nivelSkill() {
    return this.formSkill.get("nivelSkill");
  }

  get urlProyecto() {
    return this.formSkill.get("urlProyecto");
  }

}
