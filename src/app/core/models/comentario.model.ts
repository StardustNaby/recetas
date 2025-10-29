export interface Comentario {
  id_comentario: string;
  id_publicacion: string; // FK a PUBLICACION
  id_usuario: string; // Autor del comentario
  contenido: string;
  fecha_creacion: Date;
}

