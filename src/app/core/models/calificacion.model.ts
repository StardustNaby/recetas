export interface Calificacion {
  id_calificacion: string;
  id_publicacion: string; // FK a PUBLICACION
  id_usuario: string;
  puntuacion: number; // Típicamente 1-5
  fecha_creacion: Date;
}

