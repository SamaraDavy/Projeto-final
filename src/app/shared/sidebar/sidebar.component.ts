import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  menuAberto = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  abrirMenu(): void {
    this.menuAberto = true;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  logout(): void {
    this.fecharMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
