import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Publications } from '../../core/services/publications';
import { Publicacion } from '../../core/models/publicacion.model';

@Component({
  selector: 'app-publication-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './publication-list.html',
  styleUrl: './publication-list.scss',
})
export class PublicationList implements OnInit {
  publications: Publicacion[] = [];

  constructor(
    private readonly publicationsService: Publications,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.publications = this.publicationsService.getAll();
  }

  viewPublication(id: string): void {
    this.router.navigate(['/publicaciones', id]);
  }
}
