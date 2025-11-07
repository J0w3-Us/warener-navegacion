import { Routes } from '@angular/router';
import { ListaNoticiasComponent } from './components/lista-noticias/lista-noticias';
import { DetalleNoticiaComponent } from './components/detalle-noticia/detalle-noticia';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterComponent },
    { path: 'noticias', component: ListaNoticiasComponent, canActivate: [AuthGuard] },
    { path: 'noticias/:id', component: DetalleNoticiaComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
