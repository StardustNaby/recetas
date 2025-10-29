import { Comentario } from './comentario.model';

export interface RespuestaComentario {
  id_respuesta: string;
  id_comentario: string; // FK a COMENTARIO (auto-relación)
  id_usuario: string; // Autor de la respuesta
  contenido: string;
  fecha_creacion: Date;
  // Relación expandida
  comentario_padre?: Comentario;
}

