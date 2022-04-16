import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/service/token.service';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  isLogged:boolean = false;

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged();
  }

  onLogOut(): void {
    this.tokenService.logOut();
  }
}
