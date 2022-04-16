import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../models/interfaces/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  skillURL = 'http://localhost:8080/portfolio/skill/'

  constructor(private httpClient: HttpClient) { }

  public lista(id: number): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(this.skillURL + `traer/${id}`);
  }

  public getById(id: number): Observable<Skill> {
    return this.httpClient.get<Skill>(this.skillURL + `traerid/${id}`);
  }

  public save(skill: Skill, id: number): Observable<any> {
    return this.httpClient.post<any>(this.skillURL + `crear/${id}`, skill);
  }

  public update(id: number, skill: Skill): Observable<any> {
    return this.httpClient.put<any>(this.skillURL + `editar/${id}`, skill);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.skillURL + `borrar/${id}`);
  }
}

