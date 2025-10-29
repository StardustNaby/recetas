export interface Voto {
  id_voto: string;
  id_publicacion: string; // FK a PUBLICACION
  id_usuario: string;
  tipo_voto: 'UPVOTE' | 'DOWNVOTE';
  fecha_creacion: Date;
}

