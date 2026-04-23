import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ApiService } from '../../core/services/api.service';
import { Luta } from '../../models/luta';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './painel.html',
  styleUrl: './painel.css'
})
export class Painel implements OnInit {
  // Variáveis que o seu componente de apostas utiliza
  fighters: Luta[] = [];
  filteredFighters: Luta[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  f1: any = null;
  f2: any = null;

  bet: any = {
    winner: null,
    method: null,
    round: null
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.apiService.getLutas().subscribe({
      next: (res) => {
        // Mapeamos os 175 atletas do banco para a estrutura que seu HTML pede
        this.fighters = res.map(f => ({
          ...f,
          fotoUrl: `/fotos/${this.formatarImagem(f.name)}`
        }));
        this.filteredFighters = this.fighters;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erro ao carregar atletas:", err);
        this.loading = false;
      }
    });
  }

  // Sua lógica de filtro original
  filterFighters() {
    const term = this.searchTerm.toLowerCase();
    this.filteredFighters = this.fighters.filter(f => 
      f.name.toLowerCase().includes(term) || 
      f.weightClass.toLowerCase().includes(term)
    );
  }

  // Sua lógica de seleção original
  select(fighter: Luta) {
    if (this.f1?._id === fighter._id) { this.f1 = null; return; }
    if (this.f2?._id === fighter._id) { this.f2 = null; return; }

    if (!this.f1) {
      this.f1 = fighter;
    } else if (!this.f2) {
      this.f2 = fighter;
    }
  }

  // Sua função de confirmar
  confirm() {
    console.log("Aposta Confirmada:", {
      confronto: `${this.f1.name} vs ${this.f2.name}`,
      ...this.bet
    });
    alert("Aposta registrada!");
  }

  // Auxiliar para ligar o nome do banco com o arquivo em public/fotos/
  formatarImagem(nome: string): string {
    if (!nome) return 'nav.png';
    return nome.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '') + '.png';
  }
}