import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Recipes } from '../../core/services/recipes';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-recipe-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './recipe-create.html',
  styleUrl: './recipe-create.scss',
})
export class RecipeCreate {
  fotoPreview: string | undefined;

  readonly form = this.formBuilder.nonNullable.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    tiempo_preparacion: [30, [Validators.required, Validators.min(1)]],
    foto: [''],
    ingredientes: this.formBuilder.array([
      this.createIngredienteFormGroup()
    ]),
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly recipesService: Recipes,
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  get ingredientesArray(): FormArray {
    return this.form.get('ingredientes') as FormArray;
  }

  createIngredienteFormGroup() {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(0.1)]],
      unidad: ['', Validators.required],
    });
  }

  addIngrediente(): void {
    this.ingredientesArray.push(this.createIngredienteFormGroup());
  }

  removeIngrediente(index: number): void {
    if (this.ingredientesArray.length > 1) {
      this.ingredientesArray.removeAt(index);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.fotoPreview = base64;
        this.form.patchValue({ foto: base64 });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.currentUser();
    if (!user) {
      this.snackBar.open('Debes iniciar sesión', 'Cerrar', { duration: 3000 });
      return;
    }

    const { titulo, descripcion, tiempo_preparacion, foto, ingredientes } = this.form.value;

    // Crear receta
    const receta = this.recipesService.create({
      titulo: titulo!,
      descripcion: descripcion!,
      tiempo_preparacion: tiempo_preparacion!,
      foto: foto || undefined,
      id_usuario: user.id_usuario,
    });

    // Agregar ingredientes (mock - en producción se haría con API)
    ingredientes?.forEach(ing => {
      if (ing.nombre && ing.cantidad && ing.unidad) {
        this.recipesService.addIngrediente(receta.id_receta, {
          id_receta: receta.id_receta,
          id_ingrediente: `ing_${Date.now()}_${Math.random()}`,
          cantidad: ing.cantidad,
          id_unidad: ing.unidad,
        });
      }
    });

    this.snackBar.open('Receta creada exitosamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/recetas', receta.id_receta]);
  }
}
