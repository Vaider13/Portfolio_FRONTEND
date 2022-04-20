import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './components/portfolio/portfolio.component';


const routes: Routes = [
  { path: '', component: PortfolioComponent }//, canActivate: [GuardsService], data: { expectedRol: ['admin', 'user'] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
