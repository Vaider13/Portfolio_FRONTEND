import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, } from '@angular/core';
import { Educacion } from 'src/app/models/interfaces/educacion';


@Component({
  selector: 'app-educacion-item',
  templateUrl: './educacion-item.component.html',
  styleUrls: ['./educacion-item.component.css']
})
export class EducacionItemComponent implements OnInit {
  @Input() educacion: Educacion;
  @Output() OnDeleteEducacion: EventEmitter<Educacion> = new EventEmitter();
  @Output() OnEditEducacion: EventEmitter<Educacion> = new EventEmitter();


  constructor() {
  }

  ngOnInit(): void {}

  onEdit(educacion: Educacion) {
    this.OnEditEducacion.emit(educacion);
  }

  onDelete(educacion: Educacion) {
    this.OnDeleteEducacion.emit(educacion);
  }
}


