import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Skill } from 'src/app/models/interfaces/skill';

@Component({
  selector: 'app-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.css']
})
export class SkillItemComponent implements OnInit {


  @Input() skill: Skill;
  @Output() OnDeleteSkill: EventEmitter<Skill> = new EventEmitter();
  @Output() OnEditSkill: EventEmitter<Skill> = new EventEmitter();
  outColorHard: string= "#0a78ff";
  innerColorHard: string= "#034494";


  constructor() {
  }

  ngOnInit(): void {}

  onEdit(skill: Skill) {
    this.OnEditSkill.emit(skill);
  }

  onDelete(skill: Skill) {
    this.OnDeleteSkill.emit(skill);
  }

}
