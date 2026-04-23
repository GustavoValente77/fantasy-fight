import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score.html',
  styleUrls: ['./score.css']
})
export class Score {

  ranking = [
    { nome: 'João', pontos: 1250 },
    { nome: 'Carlos', pontos: 980 },
    { nome: 'Ana', pontos: 870 },
    { nome: 'João', pontos: 760 },
    { nome: 'Marcos', pontos: 640 }
  ];

}