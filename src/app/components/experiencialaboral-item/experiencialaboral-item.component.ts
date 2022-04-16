import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExperienciaLaboral } from 'src/app/models/interfaces/experiencialaboral';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-experiencialaboral-item',
  templateUrl: './experiencialaboral-item.component.html',
  styleUrls: ['./experiencialaboral-item.component.css']
})
export class ExperiencialaboralItemComponent implements OnInit {

  @Input() trabajo: ExperienciaLaboral;
  @Output() OnEditTrabajo: EventEmitter<ExperienciaLaboral> = new EventEmitter();
  isLogged: boolean = false;

  constructor(private tokenService:TokenService) {
  }


  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged()
  }

  onEdit(trabajo: ExperienciaLaboral) {
    this.OnEditTrabajo.emit(trabajo);
  }

}
