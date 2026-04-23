import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  user: any = null;

  ngOnInit() {
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
    }
  }
}