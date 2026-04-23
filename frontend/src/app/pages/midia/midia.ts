import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-midia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './midia.html',
  styleUrls: ['./midia.css']
})
export class Midia {

  novoPost: string = '';

  posts = [
    { user: 'admin', content: 'Bem-vindo ao Fantasy!', time: 'agora' }
  ];

  postar() {
    if (!this.novoPost.trim()) return;

    this.posts.unshift({
      user: 'Você',
      content: this.novoPost,
      time: 'agora'
    });

    this.novoPost = '';
  }
}