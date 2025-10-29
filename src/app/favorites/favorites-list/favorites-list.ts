import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Favorites } from '../../core/services/favorites';
import { Recipes } from '../../core/services/recipes';
import { Publications } from '../../core/services/publications';
import { Receta } from '../../core/models/receta.model';
import { Publicacion } from '../../core/models/publicacion.model';

interface FavoriteItem {
  id: string;
  type: 'receta' | 'publicacion';
  data: Receta | Publicacion;
}

@Component({
  selector: 'app-favorites-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.scss',
})
export class FavoritesList implements OnInit {
  favorites: FavoriteItem[] = [];

  constructor(
    private readonly favoritesService: Favorites,
    private readonly recipesService: Recipes,
    private readonly publicationsService: Publications,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const favoriteIds = this.favoritesService.getAll();

    const items: FavoriteItem[] = [];
    favoriteIds.forEach(id => {
      // Intentar buscar como receta primero
      const receta = this.recipesService.getById(id);
      if (receta) {
        items.push({ id, type: 'receta', data: receta });
        return;
      }

      // Si no es receta, buscar como publicación
      const publicacion = this.publicationsService.getById(id);
      if (publicacion) {
        items.push({ id, type: 'publicacion', data: publicacion });
      }
    });

    this.favorites = items;
  }

  getRecipe(item: FavoriteItem): Receta | null {
    return item.type === 'receta' ? (item.data as Receta) : null;
  }

  getPublication(item: FavoriteItem): Publicacion | null {
    return item.type === 'publicacion' ? (item.data as Publicacion) : null;
  }

  removeFavorite(id: string): void {
    this.favoritesService.remove(id);
    this.favorites = this.favorites.filter(f => f.id !== id);
  }

  viewItem(item: FavoriteItem): void {
    if (item.type === 'receta') {
      this.router.navigate(['/recetas', item.id]);
    } else {
      this.router.navigate(['/publicaciones', item.id]);
    }
  }

  getRecipeImagePath(receta: Receta): string | undefined {
    if (receta.foto) return receta.foto;

    const titulo = receta.titulo.toLowerCase();
    if (titulo.includes('pasta')) {
      return '/assets/images/Pasta.jpg';
    } else if (titulo.includes('ensalada') || titulo.includes('césar') || titulo.includes('cesar')) {
      return '/assets/images/Ensalada.jpg';
    }

    return undefined;
  }

  getPublicationImagePath(pub: Publicacion): string | undefined {
    if (pub.fotos && pub.fotos.length > 0) {
      return pub.fotos[0];
    }

    if (pub.tipo === 'receta_referenciada' && pub.id_receta_referenciada) {
      const receta = this.recipesService.getById(pub.id_receta_referenciada);
      if (receta) {
        return this.getRecipeImagePath(receta);
      }
    }

    return undefined;
  }
}
