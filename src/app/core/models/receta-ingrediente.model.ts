import { Receta } from './receta.model';
import { Ingrediente } from './ingrediente.model';
import { UnidadDeMedida } from './unidad-de-medida.model';

export interface RecetaIngrediente {
  id_receta_ingrediente: string;
  id_receta: string;
  id_ingrediente: string;
  cantidad: number;
  id_unidad?: string; // FK opcional a UNIDAD_DE_MEDIDA
  // Relaciones expandidas (cuando se carga desde API)
  receta?: Receta;
  ingrediente?: Ingrediente;
  unidad?: UnidadDeMedida;
}

