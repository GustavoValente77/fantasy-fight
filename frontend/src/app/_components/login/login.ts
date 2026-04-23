import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  modoCadastro = false;
  nome = '';
  senha = '';
  mensagem = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.modoCadastro = params['mode'] === 'register';
    });
  }

  entrar() {
    this.http.post<any>('http://localhost:3000/api/auth/login', {
      nome: this.nome,
      senha: this.senha
    }).subscribe({
      next: (res) => {
        this.auth.setUser(res.user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.mensagem = err.error?.msg || 'Erro ao fazer login';
      }
    });
  }

  cadastrar() {
    this.http.post<any>('http://localhost:3000/api/auth/register', {
      nome: this.nome,
      senha: this.senha
    }).subscribe({
      next: (res) => {

        if (res.user) {
          this.auth.setUser(res.user);
          this.router.navigate(['/home']);
        } else {
          this.entrar();
        }

      },
      error: (err) => {
        this.mensagem = err.error?.msg || 'Erro ao cadastrar';
      }
    });
  }

  toggleModo() {
    this.modoCadastro = !this.modoCadastro;
    this.mensagem = '';
  }
}