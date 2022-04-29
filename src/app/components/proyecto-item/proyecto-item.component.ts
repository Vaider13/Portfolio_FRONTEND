import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Proyecto } from 'src/app/models/interfaces/proyecto';
import { ProyectoImagen } from 'src/app/models/interfaces/proyecto-imagen';
import { ProyectoImagenService } from 'src/app/service/proyecto-imagen.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-proyecto-item',
  templateUrl: './proyecto-item.component.html',
  styleUrls: ['./proyecto-item.component.css']
})
export class ProyectoItemComponent implements OnInit {

  @Input() proyecto: Proyecto;
  @Output() OnEditProyecto: EventEmitter<Proyecto> = new EventEmitter();
  @Output() OnUploadImgProyecto: EventEmitter<Proyecto> = new EventEmitter();
  isLogged: boolean = false;
  imgUrl: string;
  imgId: number;
  isUploading: boolean = false;
  @Input() proyectosImg: ProyectoImagen[] = [];
  @ViewChild('imagen') imagenModal: ElementRef;
  //Configuraciones del modal.
  options: NgbModalOptions = {
    animation: true,
    centered: true,
    scrollable: true,
    backdrop: 'static',
    size: 'xl'
  }

  constructor(private tokenService: TokenService,
    private proyectImageService: ProyectoImagenService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged()
  }

  //Abre el modal para mostrar la imagen con su respectiva url.
    showImagen(url: string, id: number) {
    this.imgUrl = url;
    this.imgId = id;
    this.openModal(this.imagenModal, this.options)
  }

  openModal(content: any, options: any): void  {
    this.modalService.open(content, options)
  }

  onEdit(proyecto: Proyecto): void  {
    this.OnEditProyecto.emit(proyecto);
  }

  addImagen(proyecto: Proyecto): void{
    this.OnUploadImgProyecto.emit(proyecto);
  }


  //Borra la URL almacenada de una imagen.
  borrarImagen(): void {
    this.proyectImageService.delete(this.imgId)
      .subscribe(
        () => {
          this.proyectosImg = this.proyectosImg.filter(t => t.id !== this.imgId)
        },
        err => {
          console.log(err);
        });
  }

 }
