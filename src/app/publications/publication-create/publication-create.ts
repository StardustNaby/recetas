import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Publications } from '../../core/services/publications';
import { Recipes } from '../../core/services/recipes';
import { Auth } from '../../core/services/auth';
import { Receta } from '../../core/models/receta.model';

@Component({
  selector: 'app-publication-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './publication-create.html',
  styleUrl: './publication-create.scss',
})
export class PublicationCreate implements OnInit {
  tipoPublicacion: 'receta_referenciada' | 'opinion' = 'opinion';
  recetas: Receta[] = [];
  fotos: string[] = []; // Array de base64 strings

  readonly form = this.formBuilder.nonNullable.group({
    titulo: [''],
    contenido: ['', [Validators.required]],
    id_receta_referenciada: [''],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly publicationsService: Publications,
    private readonly recipesService: Recipes,
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.recetas = this.recipesService.getAll();

    if (this.tipoPublicacion === 'receta_referenciada') {
      this.form.get('id_receta_referenciada')?.setValidators([Validators.required]);
    }
  }

  onTipoChange(tipo: 'receta_referenciada' | 'opinion'): void {
    this.tipoPublicacion = tipo;
    if (tipo === 'receta_referenciada') {
      this.form.get('id_receta_referenciada')?.setValidators([Validators.required]);
      this.form.get('titulo')?.setValidators([Validators.required]);
    } else {
      this.form.get('id_receta_referenciada')?.clearValidators();
      this.form.get('titulo')?.clearValidators();
    }
    this.form.get('id_receta_referenciada')?.updateValueAndValidity();
    this.form.get('titulo')?.updateValueAndValidity();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          this.fotos.push(base64);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removePhoto(index: number): void {
    this.fotos.splice(index, 1);
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

    const { titulo, contenido, id_receta_referenciada } = this.form.value;

    const publicacion = this.publicationsService.create({
      titulo: titulo || undefined,
      contenido: contenido!,
      fotos: this.fotos.length > 0 ? this.fotos : undefined,
      id_usuario: user.id_usuario,
      id_receta_referenciada: id_receta_referenciada || undefined,
      tipo: this.tipoPublicacion,
    });

    this.snackBar.open('Publicación creada exitosamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/recetas']);
  }
}
