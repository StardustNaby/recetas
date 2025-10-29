import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Recipes } from '../../core/services/recipes';
import { Receta } from '../../core/models/receta.model';
import { Favorites } from '../../core/services/favorites';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList implements OnInit {
  recipes: Receta[] = [];

  constructor(
    private readonly recipesService: Recipes,
    private readonly favorites: Favorites,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.recipes = this.recipesService.getAll();
  }

  toggleFavorite(id: string): void {
    if (this.favorites.has(id)) {
      this.favorites.remove(id);
    } else {
      this.favorites.add(id);
    }
  }

  isFavorite(id: string): boolean {
    return this.favorites.has(id);
  }

  viewRecipe(id: string): void {
    this.router.navigate(['/recetas', id]);
  }
}
