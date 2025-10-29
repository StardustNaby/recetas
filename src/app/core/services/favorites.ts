import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
  private readonly storageKey = 'ricetta_favorites';

  getAll(): string[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  add(id: string): void {
    const set = new Set(this.getAll());
    set.add(id);
    localStorage.setItem(this.storageKey, JSON.stringify([...set]));
  }

  remove(id: string): void {
    const set = new Set(this.getAll());
    set.delete(id);
    localStorage.setItem(this.storageKey, JSON.stringify([...set]));
  }

  has(id: string): boolean {
    return this.getAll().includes(id);
  }
}
