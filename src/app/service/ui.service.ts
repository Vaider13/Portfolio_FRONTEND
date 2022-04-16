import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
   showEducacionForm: Boolean;
   subjet = new Subject<Boolean>();

  constructor() { }

  setShowEducacionForm(showFormEducacion: Boolean) {
    this.showEducacionForm = showFormEducacion;
    this.subjet.next(this.showEducacionForm);
  }

}
