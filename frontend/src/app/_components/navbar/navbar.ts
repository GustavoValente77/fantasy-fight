import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {

  user: any = null;
  menuAberto = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

  irCadastro() {
    this.router.navigate(['/login'], {
      queryParams: { mode: 'register' }
    });
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  irPerfil() {
    this.menuAberto = false;
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.auth.logout();
    this.menuAberto = false;
    this.router.navigate(['/home']);
  }

  getInicial() {
    return this.user?.nome?.charAt(0).toUpperCase();
  }
}