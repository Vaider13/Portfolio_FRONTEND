import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { RedSocial } from 'src/app/models/interfaces/red-social';
import { RedsocialService } from 'src/app/service/redsocial.service';

@Component({
  selector: 'app-redes-sociales',
  templateUrl: './redes-sociales.component.html',
  styleUrls: ['./redes-sociales.component.css']
})
export class RedesSocialesComponent implements OnInit {

  redesSociales: RedSocial;
  personaId: number = parseInt(localStorage.getItem('personaId')!);
  formRedes: FormGroup;
  @ViewChild('redes') redes: ElementRef;

  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private redSocialService: RedsocialService) {
    this.formRedes = this.formBuilder.group({
      facebook: [''],
      twitter: [''],
      instagram: [''],
      linkedin: [''],
    })
  }

  ngOnInit(): void {
    this.cargarRedes();
  }

  cargarRedes(){
    this.redSocialService.getById(this.personaId).subscribe(
      data => {
        this.redesSociales = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  editarRedes() {
    this.openModal(this.redes);
    this.redSocialService.getById(this.personaId)
      .pipe(first())
      .subscribe(x => this.formRedes.patchValue(x));
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'educacionModal' })
  }

  onSubmit() {
    this.editarRedesDb();
    this.modalService.dismissAll();
  }

  editarRedesDb() {
    this.redSocialService.update(this.personaId, this.formRedes.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarRedes();
        },
        error: err => {
          console.log(err);
        }
      });

  }



}
