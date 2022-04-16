import { GuardsService } from './guards/guards.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [GuardsService], data: { expectedRol: ['admin', 'user'] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
