export interface Favorito {
  id_favorito: string;
  id_usuario: string;
  id_receta?: string; // Puede ser receta
  id_publicacion?: string; // O publicación
  fecha_agregado: Date;
}

