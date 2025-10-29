import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly currentUserKey = 'ricetta_current_user';
  currentUser = signal<User | null>(null);

  constructor(private readonly router: Router) {
    const stored = localStorage.getItem(this.currentUserKey);
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  login(email: string, password: string): boolean {
    // Mock: en producción esto sería una llamada HTTP
    const mockUsers = this.getMockUsers();
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      this.currentUser.set(userWithoutPassword as User);
      localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }

  register(email: string, password: string, nivel: User['nivel'], fotoPerfil?: string): User {
    // Mock: en producción esto sería una llamada HTTP
    const newUser: User & { password: string } = {
      id_usuario: `user_${Date.now()}`,
      email,
      password, // Solo para almacenar localmente en mock
      nivel,
      foto_perfil: fotoPerfil,
      fecha_registro: new Date(),
    };

    const users = this.getMockUsers();
    users.push(newUser);
    localStorage.setItem('ricetta_mock_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    this.currentUser.set(userWithoutPassword as User);
    localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));

    return userWithoutPassword as User;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  private getMockUsers(): (User & { password: string })[] {
    const stored = localStorage.getItem('ricetta_mock_users');
    if (stored) {
      return JSON.parse(stored);
    }
    // Usuarios por defecto para testing
    const defaultUsers: (User & { password: string })[] = [
      {
        id_usuario: 'user_1',
        email: 'test@test.com',
        password: 'test123!',
        nivel: 'intermedio',
        fecha_registro: new Date(),
      }
    ];
    localStorage.setItem('ricetta_mock_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
}
