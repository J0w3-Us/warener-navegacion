import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastsComponent } from './shared/toasts.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UiService } from './shared/ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('interfac-services');
  constructor(private auth: AuthService, private router: Router, private ui: UiService) {}

  get isLogged() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  openCreate() {
    // Emit event so ListaNoticiasComponent can open the create overlay
    this.ui.emitOpenCreate();
  }
}
