import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonaDto } from '../models/interfaces/persona-dto';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor( private httpClient: HttpClient) { }

  personaURL = 'http://localhost:8080/persona/';

  public getPersona(personaId:number): Observable<PersonaDto> {
    return this.httpClient.get<PersonaDto>(this.personaURL + `traer/${personaId}`);
  }

  public getPersonaByUsuarioId(usuarioId:number): Observable<PersonaDto> {
    return this.httpClient.get<PersonaDto>(this.personaURL + `traer/usuario/${usuarioId}`);
  }

  public update(id:number, persona:PersonaDto): Observable<any> {
    return this.httpClient.put<any>(this.personaURL + `editar/${id}`, persona);
  }

}
