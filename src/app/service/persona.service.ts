import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonaDto } from '../models/interfaces/persona-dto';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor( private httpClient: HttpClient) { }

  personaURL = 'https://guarded-beach-45939.herokuapp.com/persona/';

  //Se obtiene una persona por medio de su ID.
  public getPersona(personaId:number): Observable<PersonaDto> {
    return this.httpClient.get<PersonaDto>(this.personaURL + `traer/${personaId}`);
  }

  //Se obtiene una persona por medio del ID del usuario perteneciente a la misma.
  public getPersonaByUsuarioId(usuarioId:number): Observable<PersonaDto> {
    return this.httpClient.get<PersonaDto>(this.personaURL + `traer/usuario/${usuarioId}`);
  }

  //Se edita una persona por medio de su ID.
  public update(id:number, persona:PersonaDto): Observable<any> {
    return this.httpClient.put<any>(this.personaURL + `editar/${id}`, persona);
  }

}
