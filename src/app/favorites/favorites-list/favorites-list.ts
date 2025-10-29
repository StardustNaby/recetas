import { Component, OnInit } from '@angular/core';
import { Favorites } from '../../core/services/favorites';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-favorites-list',
  imports: [NgFor, NgIf],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.scss',
})
export class FavoritesList implements OnInit {
  constructor(private readonly favorites: Favorites) {}
  items: string[] = [];

  ngOnInit(): void {
    this.items = this.favorites.getAll();
  }
}
