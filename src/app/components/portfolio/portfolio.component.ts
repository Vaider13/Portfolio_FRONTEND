import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/service/token.service';
import { UsuarioService } from 'src/app/service/usuario.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  userName: string;

  constructor(private tokenService: TokenService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {

  }
}
