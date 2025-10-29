import { Injectable, signal } from '@angular/core';
import { Publicacion } from '../models/publicacion.model';
import { Comentario } from '../models/comentario.model';
import { Voto } from '../models/voto.model';

@Injectable({
  providedIn: 'root'
})
export class Publications {
  private readonly storageKey = 'ricetta_publicaciones';

  publications = signal<Publicacion[]>([]);

  constructor() {
    this.loadPublications();
  }

  getAll(): Publicacion[] {
    return this.publications();
  }

  getById(id: string): Publicacion | undefined {
    return this.publications().find(p => p.id_publicacion === id);
  }

  create(publicacion: Omit<Publicacion, 'id_publicacion' | 'fecha_creacion'>): Publicacion {
    const newPub: Publicacion = {
      ...publicacion,
      id_publicacion: `pub_${Date.now()}`,
      fecha_creacion: new Date(),
    };

    const pubs = [...this.publications(), newPub];
    this.publications.set(pubs);
    this.savePublications(pubs);

    return newPub;
  }

  // Comentarios
  getComentarios(publicacionId: string): Comentario[] {
    const stored = localStorage.getItem(`ricetta_comentarios_${publicacionId}`);
    return stored ? JSON.parse(stored).map((c: any) => ({ ...c, fecha_creacion: new Date(c.fecha_creacion) })) : [];
  }

  addComentario(publicacionId: string, comentario: Omit<Comentario, 'id_comentario' | 'fecha_creacion'>): Comentario {
    const comentarios = this.getComentarios(publicacionId);
    const newComentario: Comentario = {
      ...comentario,
      id_comentario: `com_${Date.now()}`,
      fecha_creacion: new Date(),
    };
    comentarios.push(newComentario);
    localStorage.setItem(`ricetta_comentarios_${publicacionId}`, JSON.stringify(comentarios));
    return newComentario;
  }

  // Votos
  getVotos(publicacionId: string): Voto[] {
    const stored = localStorage.getItem(`ricetta_votos_${publicacionId}`);
    return stored ? JSON.parse(stored).map((v: any) => ({ ...v, fecha_creacion: new Date(v.fecha_creacion) })) : [];
  }

  getVoteCount(publicacionId: string): { upvotes: number; downvotes: number } {
    const votos = this.getVotos(publicacionId);
    return {
      upvotes: votos.filter(v => v.tipo_voto === 'UPVOTE').length,
      downvotes: votos.filter(v => v.tipo_voto === 'DOWNVOTE').length,
    };
  }

  addVoto(publicacionId: string, usuarioId: string, tipoVoto: 'UPVOTE' | 'DOWNVOTE'): Voto | null {
    const votos = this.getVotos(publicacionId);
    // Eliminar voto previo del usuario si existe
    const filtered = votos.filter(v => v.id_usuario !== usuarioId);

    const newVoto: Voto = {
      id_voto: `voto_${Date.now()}`,
      id_publicacion: publicacionId,
      id_usuario: usuarioId,
      tipo_voto: tipoVoto,
      fecha_creacion: new Date(),
    };

    filtered.push(newVoto);
    localStorage.setItem(`ricetta_votos_${publicacionId}`, JSON.stringify(filtered));
    return newVoto;
  }

  removeVoto(publicacionId: string, usuarioId: string): boolean {
    const votos = this.getVotos(publicacionId).filter(v => v.id_usuario !== usuarioId);
    localStorage.setItem(`ricetta_votos_${publicacionId}`, JSON.stringify(votos));
    return true;
  }

  private loadPublications(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const pubs = JSON.parse(stored);
      this.publications.set(pubs.map((p: any) => ({ ...p, fecha_creacion: new Date(p.fecha_creacion) })));
    } else {
      this.publications.set([]);
      this.savePublications([]);
    }
  }

  private savePublications(publications: Publicacion[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(publications));
  }
}
