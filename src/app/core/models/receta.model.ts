import { InformacionNutricional } from './informacion-nutricional.model';

export interface Receta {
  id_receta: string;
  titulo: string;
  descripcion: string;
  tiempo_preparacion: number; // en minutos
  foto?: string; // URL o base64
  id_usuario: string; // Autor
  fecha_creacion: Date;
  informacion_nutricional?: InformacionNutricional;
}
