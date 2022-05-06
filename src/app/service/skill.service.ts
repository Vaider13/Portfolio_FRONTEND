import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../models/interfaces/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  skillURL = 'https://guarded-beach-45939.herokuapp.com/skill/'

  constructor(private httpClient: HttpClient) { }

  //Trae todas las skills pertenecientes a una persona por medio de su ID.
  public lista(id: number): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(this.skillURL + `traer/${id}`);
  }

  //Trae una skill por medio de su ID.
  public getById(id: number): Observable<Skill> {
    return this.httpClient.get<Skill>(this.skillURL + `traerid/${id}`);
  }

  //Guarda una nueva skill perteneciente a una persona, por medio del ID de la misma.
  public save(skill: Skill, id: number): Observable<any> {
    return this.httpClient.post<any>(this.skillURL + `crear/${id}`, skill);
  }

  //Actualiza una skill por medio de su ID.
  public update(id: number, skill: Skill): Observable<any> {
    return this.httpClient.put<any>(this.skillURL + `editar/${id}`, skill);
  }

  //Borra una skill por medio de su ID.
  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.skillURL + `borrar/${id}`);
  }
}

