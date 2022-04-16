import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { RedSocial } from 'src/app/models/interfaces/red-social';
import { RedsocialService } from 'src/app/service/redsocial.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-redes-sociales',
  templateUrl: './redes-sociales.component.html',
  styleUrls: ['./redes-sociales.component.css']
})
export class RedesSocialesComponent implements OnInit {

  redesSociales: RedSocial;
  urlReg  = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  personaId: number = 1;
  formRedes: FormGroup;
  @ViewChild('redes') redes: ElementRef;
  isLogged: boolean = false;

  constructor(private modalService: NgbModal,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private redSocialService: RedsocialService) {
    this.formRedes = this.formBuilder.group({
      facebook: ['', [Validators.pattern(this.urlReg)]],
      twitter: ['', [Validators.pattern(this.urlReg)]],
      instagram: ['', [Validators.pattern(this.urlReg)]],
      linkedin: ['', [Validators.pattern(this.urlReg)]],
    })
  }

  ngOnInit(): void {
    this.cargarRedes();
    this.isLogged = this.tokenService.isLogged()
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

  get instagram() {
    return this.formRedes.get("instagram");
  }

  get facebook() {
    return this.formRedes.get("facebook");
  }

  get twitter() {
    return this.formRedes.get("twitter");
  }

  get linkedin() {
    return this.formRedes.get("linkedin");
  }


}
