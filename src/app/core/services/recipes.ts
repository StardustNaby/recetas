import { Injectable, signal } from '@angular/core';
import { Receta } from '../models/receta.model';
import { RecetaIngrediente } from '../models/receta-ingrediente.model';
import { Ingrediente } from '../models/ingrediente.model';
import { UnidadDeMedida } from '../models/unidad-de-medida.model';

@Injectable({
  providedIn: 'root'
})
export class Recipes {
  private readonly storageKey = 'ricetta_recetas';

  // Señal para reactividad
  recipes = signal<Receta[]>([]);

  constructor() {
    this.loadRecipes();
  }

  getAll(): Receta[] {
    return this.recipes();
  }

  getById(id: string): Receta | undefined {
    return this.recipes().find(r => r.id_receta === id);
  }

  create(receta: Omit<Receta, 'id_receta' | 'fecha_creacion'>): Receta {
    const newReceta: Receta = {
      ...receta,
      id_receta: `receta_${Date.now()}`,
      fecha_creacion: new Date(),
    };

    const recipes = [...this.recipes(), newReceta];
    this.recipes.set(recipes);
    this.saveRecipes(recipes);

    return newReceta;
  }

  update(id: string, updates: Partial<Receta>): Receta | null {
    const recipes = this.recipes();
    const index = recipes.findIndex(r => r.id_receta === id);

    if (index === -1) return null;

    const updated = { ...recipes[index], ...updates };
    recipes[index] = updated;
    this.recipes.set([...recipes]);
    this.saveRecipes(recipes);

    return updated;
  }

  delete(id: string): boolean {
    const recipes = this.recipes().filter(r => r.id_receta !== id);
    this.recipes.set(recipes);
    this.saveRecipes(recipes);
    return true;
  }

  // Mock: obtener ingredientes de una receta
  getIngredientes(recetaId: string): RecetaIngrediente[] {
    const stored = localStorage.getItem(`ricetta_receta_ingredientes_${recetaId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Mock: agregar ingrediente a receta
  addIngrediente(recetaId: string, ingrediente: Omit<RecetaIngrediente, 'id_receta_ingrediente'>): RecetaIngrediente {
    const ingredientes = this.getIngredientes(recetaId);
    const newItem: RecetaIngrediente = {
      ...ingrediente,
      id_receta_ingrediente: `ri_${Date.now()}`,
    };
    ingredientes.push(newItem);
    localStorage.setItem(`ricetta_receta_ingredientes_${recetaId}`, JSON.stringify(ingredientes));
    return newItem;
  }

  private loadRecipes(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const recipes = JSON.parse(stored);
      this.recipes.set(recipes.map((r: any) => ({ ...r, fecha_creacion: new Date(r.fecha_creacion) })));
    } else {
      // Datos mock iniciales
      const mockRecipes: Receta[] = [
        {
          id_receta: 'receta_1',
          titulo: 'Pasta Carbonara',
          descripcion: 'Una deliciosa pasta carbonara tradicional italiana con crema, huevo y panceta.',
          tiempo_preparacion: 30,
          foto: undefined,
          id_usuario: 'user_1',
          fecha_creacion: new Date(),
        },
        {
          id_receta: 'receta_2',
          titulo: 'Ensalada César',
          descripcion: 'Ensalada fresca con lechuga romana, pollo, crutones y aderezo césar.',
          tiempo_preparacion: 20,
          foto: undefined,
          id_usuario: 'user_1',
          fecha_creacion: new Date(),
        },
      ];
      this.recipes.set(mockRecipes);
      this.saveRecipes(mockRecipes);
    }
  }

  private saveRecipes(recipes: Receta[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(recipes));
  }
}
