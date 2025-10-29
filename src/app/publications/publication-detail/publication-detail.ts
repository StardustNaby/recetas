import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Publications } from '../../core/services/publications';
import { Auth } from '../../core/services/auth';
import { Publicacion } from '../../core/models/publicacion.model';
import { Comentario } from '../../core/models/comentario.model';
import { Voto } from '../../core/models/voto.model';

@Component({
  selector: 'app-publication-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './publication-detail.html',
  styleUrl: './publication-detail.scss',
})
export class PublicationDetail implements OnInit {
  publication: Publicacion | undefined;
  comentarios: Comentario[] = [];
  votos: { upvotes: number; downvotes: number } = { upvotes: 0, downvotes: 0 };
  userVote: Voto | null = null;
  nuevoComentario = '';
  readonly commentForm;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly publicationsService: Publications,
    private readonly auth: Auth,
    private readonly formBuilder: FormBuilder
  ) {
    this.commentForm = this.formBuilder.nonNullable.group({
      contenido: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publication = this.publicationsService.getById(id);
      if (this.publication) {
        this.comentarios = this.publicationsService.getComentarios(id);
        this.votos = this.publicationsService.getVoteCount(id);

        const user = this.auth.currentUser();
        if (user) {
          const userVotos = this.publicationsService.getVotos(id);
          this.userVote = userVotos.find(v => v.id_usuario === user.id_usuario) || null;
        }
      } else {
        this.router.navigate(['/recetas']);
      }
    }
  }

  vote(tipo: 'UPVOTE' | 'DOWNVOTE'): void {
    if (!this.publication) return;

    const user = this.auth.currentUser();
    if (!user) return;

    // Si ya votó de la misma manera, remover voto
    if (this.userVote?.tipo_voto === tipo) {
      this.publicationsService.removeVoto(this.publication.id_publicacion, user.id_usuario);
      this.userVote = null;
    } else {
      // Agregar o cambiar voto
      this.userVote = this.publicationsService.addVoto(
        this.publication.id_publicacion,
        user.id_usuario,
        tipo
      );
    }

    this.votos = this.publicationsService.getVoteCount(this.publication.id_publicacion);
  }

  addComentario(): void {
    if (this.commentForm.invalid || !this.publication) return;

    const user = this.auth.currentUser();
    if (!user) return;

    const contenido = this.commentForm.value.contenido;
    if (!contenido) return;

    this.publicationsService.addComentario(this.publication.id_publicacion, {
      id_publicacion: this.publication.id_publicacion,
      id_usuario: user.id_usuario,
      contenido,
    });

    this.comentarios = this.publicationsService.getComentarios(this.publication.id_publicacion);
    this.commentForm.reset();
  }
}
