import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { Recipes } from '../../core/services/recipes';
import { Publications } from '../../core/services/publications';
import { Favorites } from '../../core/services/favorites';
import { Auth } from '../../core/services/auth';
import { Receta } from '../../core/models/receta.model';
import { RecetaIngrediente } from '../../core/models/receta-ingrediente.model';
import { Comentario } from '../../core/models/comentario.model';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatListModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  recipe: Receta | undefined;
  ingredientes: RecetaIngrediente[] = [];
  comentarios: Comentario[] = [];
  nuevoComentario = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly recipesService: Recipes,
    private readonly publicationsService: Publications,
    private readonly favorites: Favorites,
    private readonly auth: Auth
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipe = this.recipesService.getById(id);
      if (this.recipe) {
        this.ingredientes = this.recipesService.getIngredientes(id);
        // Los comentarios están en publicaciones, pero podemos comentar recetas también
        // Por ahora solo mostramos ingredientes
      } else {
        this.router.navigate(['/recetas']);
      }
    }
  }

  toggleFavorite(): void {
    if (!this.recipe) return;
    const id = this.recipe.id_receta;
    if (this.favorites.has(id)) {
      this.favorites.remove(id);
    } else {
      this.favorites.add(id);
    }
  }

  isFavorite(): boolean {
    return this.recipe ? this.favorites.has(this.recipe.id_receta) : false;
  }

  addComentario(): void {
    if (!this.recipe || !this.nuevoComentario.trim() || !this.auth.currentUser()) return;

    // En el modelo actual, los comentarios van en publicaciones
    // Para recetas, necesitaríamos crear una publicación relacionada o ajustar el modelo
    // Por ahora, esto es un placeholder
    this.nuevoComentario = '';
  }
}
