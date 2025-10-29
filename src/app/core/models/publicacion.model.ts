export interface Publicacion {
  id_publicacion: string;
  titulo?: string; // Opcional para publicaciones de opinión
  contenido: string;
  fotos?: string[]; // Array de URLs o base64
  id_usuario: string; // Autor
  id_receta_referenciada?: string; // FK opcional a RECETA
  fecha_creacion: Date;
  tipo: 'receta_referenciada' | 'opinion';
}

