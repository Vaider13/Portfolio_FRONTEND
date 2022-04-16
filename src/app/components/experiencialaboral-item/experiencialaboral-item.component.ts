import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExperienciaLaboral } from 'src/app/models/interfaces/experiencialaboral';

@Component({
  selector: 'app-experiencialaboral-item',
  templateUrl: './experiencialaboral-item.component.html',
  styleUrls: ['./experiencialaboral-item.component.css']
})
export class ExperiencialaboralItemComponent implements OnInit {

  @Input() trabajo: ExperienciaLaboral;
  @Output() OnDeleteTrabajo: EventEmitter<ExperienciaLaboral> = new EventEmitter();
  @Output() OnEditTrabajo: EventEmitter<ExperienciaLaboral> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {}

  onEdit(trabajo: ExperienciaLaboral) {
    this.OnEditTrabajo.emit(trabajo);
  }

  onDelete(trabajo: ExperienciaLaboral) {
    this.OnDeleteTrabajo.emit(trabajo);
  }

}
