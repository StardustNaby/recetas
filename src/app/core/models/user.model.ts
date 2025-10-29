export interface User {
  id_usuario: string;
  email: string;
  password?: string; // Solo para creación, no debería viajar en respuestas
  nombre?: string;
  foto_perfil?: string; // URL o base64
  nivel: 'novato' | 'intermedio' | 'profesional';
  fecha_registro: Date;
}
