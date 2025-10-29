import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Publications } from '../../core/services/publications';
import { Recipes } from '../../core/services/recipes';
import { Publicacion } from '../../core/models/publicacion.model';
import { Receta } from '../../core/models/receta.model';

@Component({
  selector: 'app-publication-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './publication-list.html',
  styleUrl: './publication-list.scss',
})
export class PublicationList implements OnInit {
  publications: Publicacion[] = [];
  recipeMap: Map<string, Receta> = new Map();

  constructor(
    private readonly publicationsService: Publications,
    private readonly recipesService: Recipes,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.publications = this.publicationsService.getAll();

    // Cargar recetas referenciadas
    this.publications.forEach(pub => {
      if (pub.id_receta_referenciada) {
        const receta = this.recipesService.getById(pub.id_receta_referenciada);
        if (receta) {
          this.recipeMap.set(pub.id_publicacion, receta);
        }
      }
    });
  }

  viewPublication(id: string): void {
    this.router.navigate(['/publicaciones', id]);
  }

  getRecipeImagePath(pub: Publicacion): string | undefined {
    if (pub.tipo !== 'receta_referenciada' || !pub.id_receta_referenciada) {
      return undefined;
    }

    const receta = this.recipeMap.get(pub.id_publicacion);
    if (!receta) return undefined;

    const titulo = receta.titulo.toLowerCase();
    if (titulo.includes('pasta')) {
      return '/assets/images/Pasta.jpg';
    } else if (titulo.includes('ensalada') || titulo.includes('césar') || titulo.includes('cesar')) {
      return '/assets/images/Ensalada.jpg';
    }

    return receta.foto;
  }
}
