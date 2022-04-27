import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Proyecto } from 'src/app/models/interfaces/proyecto';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-proyecto-item',
  templateUrl: './proyecto-item.component.html',
  styleUrls: ['./proyecto-item.component.css']
})
export class ProyectoItemComponent implements OnInit {

  @Input() proyecto: Proyecto;
  @Output() OnEditProyecto: EventEmitter<Proyecto> = new EventEmitter();
  isLogged: boolean = false;

  constructor(private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged()
  }

  onEdit(proyecto: Proyecto): void  {
    this.OnEditProyecto.emit(proyecto);
  }

 }
