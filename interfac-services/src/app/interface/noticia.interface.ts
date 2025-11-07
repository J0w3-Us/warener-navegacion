export interface Noticia {
  id?: string;
  titulo: string;
  contenido: string;
  autor: string;
  fecha: string;
  categoria: string;
  imagenUrl?: string;
  destacada: boolean;
  UserAlta: string;
  FechaAlta: string;
  UserMod: string;
  FechaMod: string;
  // View helpers (optional)
  resumen?: string;
  fechaFormateada?: string;
  createdAt?: string;
  updatedAt?: string;
}
