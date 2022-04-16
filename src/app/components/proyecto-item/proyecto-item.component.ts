import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Proyecto } from 'src/app/models/interfaces/proyecto';

@Component({
  selector: 'app-proyecto-item',
  templateUrl: './proyecto-item.component.html',
  styleUrls: ['./proyecto-item.component.css']
})
export class ProyectoItemComponent implements OnInit {

  @Input() proyecto: Proyecto;
  @Output() OnDeleteProyecto: EventEmitter<Proyecto> = new EventEmitter();
  @Output() OnEditProyecto: EventEmitter<Proyecto> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {}

  onEdit(proyecto: Proyecto) {
    this.OnEditProyecto.emit(proyecto);
  }

  onDelete(proyecto: Proyecto) {
    this.OnDeleteProyecto.emit(proyecto);
  }


}
