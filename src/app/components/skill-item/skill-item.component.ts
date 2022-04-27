import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Skill } from 'src/app/models/interfaces/skill';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.css']
})
export class SkillItemComponent implements OnInit {


  @Input() skill: Skill;
  @Output() OnEditSkill: EventEmitter<Skill> = new EventEmitter();
  outColorHard: string= "#0a78ff";
  innerColorHard: string= "#034494";
  isLogged: boolean = false;


  constructor(private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged()
  }

  onEdit(skill: Skill): void  {
    this.OnEditSkill.emit(skill);
  }

}
