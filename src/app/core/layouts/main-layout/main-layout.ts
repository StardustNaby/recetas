import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TitleCasePipe } from '@angular/common';
import { Auth } from '../../services/auth';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  constructor(protected readonly auth: Auth) {}

  get user(): User | null {
    return this.auth.currentUser();
  }

  logout(): void {
    this.auth.logout();
  }
}
