import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.scss',
})
export class ProfileEdit implements OnInit {
  user: User | null = null;
  fotoPerfilPreview: string | undefined;

  readonly form = this.formBuilder.nonNullable.group({
    nombre: [''],
    nivel: ['novato' as User['nivel'], Validators.required],
    foto_perfil: [''],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.form.patchValue({
      nombre: this.user.nombre || '',
      nivel: this.user.nivel,
    });

    if (this.user.foto_perfil) {
      this.fotoPerfilPreview = this.user.foto_perfil;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.fotoPerfilPreview = base64;
        this.form.patchValue({ foto_perfil: base64 });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  submit(): void {
    if (this.form.invalid || !this.user) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, nivel, foto_perfil } = this.form.value;

    // Actualizar usuario (mock - en producción sería HTTP)
    const updatedUser: User = {
      ...this.user,
      nombre: nombre || undefined,
      nivel: nivel!,
      foto_perfil: foto_perfil || undefined,
    };

    // En un servicio real, haríamos una llamada HTTP
    // Por ahora, solo actualizamos el localStorage
    const mockUsers = JSON.parse(localStorage.getItem('ricetta_mock_users') || '[]');
    const index = mockUsers.findIndex((u: any) => u.id_usuario === this.user!.id_usuario);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...updatedUser };
      localStorage.setItem('ricetta_mock_users', JSON.stringify(mockUsers));
    }

    // Actualizar usuario actual
    this.auth.currentUser.set(updatedUser);
    localStorage.setItem('ricetta_current_user', JSON.stringify(updatedUser));

    this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/recetas']);
  }
}
