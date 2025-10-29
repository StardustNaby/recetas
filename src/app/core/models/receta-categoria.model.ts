import { Receta } from './receta.model';
import { Categoria } from './categoria.model';

export interface RecetaCategoria {
  id_receta_categoria: string;
  id_receta: string;
  id_categoria: string;
  // Relaciones expandidas
  receta?: Receta;
  categoria?: Categoria;
}

