import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-apostas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './apostas.html',
  styleUrls: ['./apostas.css']
})
export class Apostas implements OnInit {
  fighters: any[] = [];
  f1: any = null;
  f2: any = null;
  exibirModal: boolean = false;
  resumoAposta = { vencedor: '', detalhes: '' };

  palpite = {
    vencedorId: null,
    metodo: 'DEC',
    rounds: 5
  };

  listaRounds = [1, 2, 3, 4, 5];
  listaMetodos = [
    { id: 'KO', label: 'KO / TKO' },
    { id: 'SUB', label: 'Finalização' },
    { id: 'DEC', label: 'Decisão' }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarLutadores();
  }

  carregarLutadores() {
    this.http.get<any[]>('http://localhost:3000/api/sincronizar-card')
      .subscribe({
        next: (res) => {
          const fotosDisponiveis = [
            'justin gaethje',
            'khamzat chimaev',
            'alex pereira',
            'alexander volkanovski',
            'charles oliveira',
            'ilia topuria',
            'joshua van',
            'islam makhachev'
          ];

          this.fighters = res
            .filter(f => fotosDisponiveis.includes(f.name.toLowerCase().replace(' (c)', '').trim()))
            .map(f => ({
              ...f,
              fotoUrl: `/fotos/${this.formatarImagem(f.name)}`
            }));

          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
  }

  select(fighter: any) {
    if (this.f1?._id === fighter._id) {
      this.resetarAposta();
      return;
    }
    
    if (this.f2?._id === fighter._id) {
      this.f2 = null;
      return;
    }

    if (!this.f1) {
      this.f1 = fighter;
      this.palpite.vencedorId = fighter._id;
    } else if (!this.f2) {
      this.f2 = fighter;
    }
  }

  setRound(round: number) {
    this.palpite.rounds = round;
  }

  confirmarAposta() {
    const vencedor = this.f1._id === this.palpite.vencedorId ? this.f1.name : this.f2.name;
    this.resumoAposta = {
      vencedor: vencedor,
      detalhes: `${this.palpite.metodo} - Round ${this.palpite.rounds}`
    };
    this.exibirModal = true;
  }

  fecharModal() {
    this.exibirModal = false;
    this.resetarAposta();
  }

  resetarAposta() {
    this.f1 = null;
    this.f2 = null;
    this.palpite = { vencedorId: null, metodo: 'DEC', rounds: 5 };
  }

  handleImageError(event: any) {
    event.target.style.opacity = '0';
  }

  formatarImagem(nome: string): string {
    if (!nome) return '';
    return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '.png';
  }
}