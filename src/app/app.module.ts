import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { interceptorProvider } from './interceptors/port-interceptors.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { EducacionComponent } from './components/educacion/educacion.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InicioComponent } from './components/inicio/inicio.component';
import { EducacionItemComponent } from './components/educacion-item/educacion-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { ExperiencialaboralItemComponent } from './components/experiencialaboral-item/experiencialaboral-item.component';
import { LoginComponent } from './components/login/login.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { ProyectoItemComponent } from './components/proyecto-item/proyecto-item.component';
import { SkillComponent } from './components/skill/skill.component';
import { SkillItemComponent } from './components/skill-item/skill-item.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RedesSocialesComponent } from './components/redes-sociales/redes-sociales.component';


@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    TopBarComponent,
    EducacionComponent,
    PortfolioComponent,
    InicioComponent,
    EducacionItemComponent,
    ExperienciaLaboralComponent,
    ExperiencialaboralItemComponent,
    LoginComponent,
    ProyectoComponent,
    ProyectoItemComponent,
    SkillComponent,
    SkillItemComponent,
    RedesSocialesComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    NgbModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [interceptorProvider, { provide: LOCALE_ID, useValue: 'es-AR' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }