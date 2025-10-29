export interface InformacionNutricional {
  id_nutricional: string;
  id_receta: string; // FK a RECETA (1:1)
  calorias?: number;
  proteinas?: number; // gramos
  carbohidratos?: number; // gramos
  grasas?: number; // gramos
  fibra?: number; // gramos
}

