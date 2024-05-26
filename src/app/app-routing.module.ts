import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redireciona a rota raiz para login
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'minhaConta', component: MinhaContaComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Redireciona rotas inválidas para login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
