import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { Proyecto } from 'src/app/models/interfaces/proyecto';
import { ProyectoImagen } from 'src/app/models/interfaces/proyecto-imagen';
import { ProyectoImagenService } from 'src/app/service/proyecto-imagen.service';
import { SubirImagenesService } from 'src/app/service/subir-imagenes.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-proyecto-imagen',
  templateUrl: './proyecto-imagen.component.html',
  styleUrls: ['./proyecto-imagen.component.css']
})
export class ProyectoImagenComponent implements OnInit {

  imagenes: any[] = []; //Variable de subida de las imagenes en el servidor
  proyectosImg: ProyectoImagen[] = [];
  @Input() proyecto: Proyecto;
  slideIndex: number = 0;
  isUploading: boolean = false;
  isLogged: boolean = false;

  constructor(private proyectImageService: ProyectoImagenService,
    private subImg: SubirImagenesService,
    private tokenService: TokenService) { }

  //Llama a la funcion de carga de las imagenes
  ngOnInit(): void {
    this.cargarImagenes();
    this.isLogged = this.tokenService.isLogged()
  }

  //Carga las imagenes
  cargarImagenes(): void {
    this.proyectImageService.lista(this.proyecto.id).subscribe(
      data => {
        this.proyectosImg = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Abre el modal con la galeria de imagenes.
  openModal(): void  {
    document.getElementById('imgModal')!.style.display = "block";
  }

  //Cierra el modal con la galeria de imagenes.
  closeModal(): void  {
    document.getElementById('imgModal')!.style.display = "none";
  }

  //Cambia a otra iumagen con el slider.
  plusSlides(n: number): void  {
    this.showSlides(this.slideIndex += n);
  }

  //Determina en que posicion se encuentra la iumagen.
  currentSlide(n: number): void  {
    this.showSlides(this.slideIndex = n);
  }


  //Muestra los sliders para poder pasar las imagenes en la galeria.
  showSlides(n: number): void  {
    let i;
    const slides = document.getElementsByClassName("img-slides") as HTMLCollectionOf<HTMLElement>;
    const dots = document.getElementsByClassName("images") as HTMLCollectionOf<HTMLElement>;
    if (n > slides.length) {
      this.slideIndex = 1
    }
    if (n < 1) {
      this.slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex - 1].style.display = "block";
    if (dots && dots.length > 0) {
      dots[this.slideIndex - 1].className += " active";
    }
  }

   //convierte la imagen a base 64 y la sube al servidor firebase,
  //y posteriormente guarda la URL de la imagen en la base de datos.
  cargarImagen(event: any): void  {
    let archivo = event.target.files;
    let nombre = "proyectoImagen";
    let reader = new FileReader();
    reader.readAsDataURL(archivo[0]);
    reader.onloadend = () => {
      this.imagenes.push(reader.result);
      this.isUploading = true;
      this.subImg.subirImagen(nombre + "_" + Date.now(), reader.result).then(urlImagen => {
        let proyectImg: ProyectoImagen = {
          imagenUrl: urlImagen!
        }
        this.subirImagen(proyectImg);
        this.isUploading = false;
      });
    }
  }

  //Carga la URL de la imagen en la base de datos.
  subirImagen(proyectoImagen: ProyectoImagen): void  {
    this.proyectImageService.save(proyectoImagen, this.proyecto.id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.cargarImagenes();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  //Borra la URL almacenada de una imagen.
  borrarImagen(id: number): void {
    this.proyectImageService.delete(id)
      .subscribe(
        () => {
          this.proyectosImg = this.proyectosImg.filter(t => t.id !== id)
        },
        err => {
          console.log(err);
        });
  }

}
