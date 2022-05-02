import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExperienciaIdioma } from 'src/app/models/interfaces/experiencia-idioma';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-idioma-item',
  templateUrl: './idioma-item.component.html',
  styleUrls: ['./idioma-item.component.css']
})
export class IdiomaItemComponent implements OnInit {

@Input() experienciaIdioma: ExperienciaIdioma;
@Output() OnEditIdioma: EventEmitter<ExperienciaIdioma> = new EventEmitter();
isLogged: boolean = false;

constructor(private tokenService:TokenService) {
}


ngOnInit(): void {
  this.isLogged = this.tokenService.isLogged();
}

onEdit(expIdioma: ExperienciaIdioma): void  {
  this.OnEditIdioma.emit(expIdioma);
}

}
