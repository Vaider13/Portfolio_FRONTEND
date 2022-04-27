import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, } from '@angular/core';
import { Educacion } from 'src/app/models/interfaces/educacion';
import { TokenService } from 'src/app/service/token.service';


@Component({
  selector: 'app-educacion-item',
  templateUrl: './educacion-item.component.html',
  styleUrls: ['./educacion-item.component.css']
})
export class EducacionItemComponent implements OnInit {
  @Input() educacion: Educacion;
  @Output() OnEditEducacion: EventEmitter<Educacion> = new EventEmitter();
  isLogged: boolean = false;


  constructor(private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged()
  }

  onEdit(educacion: Educacion): void {
    this.OnEditEducacion.emit(educacion);
  }

}


