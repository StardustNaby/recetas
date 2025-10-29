import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  readonly form;

  private passwordsMatch = (group: any) => {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p === c ? null : { passwordMismatch: true };
  };

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      nivel: ['novato', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, nivel } = this.form.value;
    if (email && password && nivel) {
      this.auth.register(email, password, nivel as any);
      this.snackBar.open('Cuenta creada exitosamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/recetas']);
    }
  }
}
