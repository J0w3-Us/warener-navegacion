export interface Estado {
    id?: string;
    nombre: string;
	abreviacion: string;
	activo: boolean;
	UserAlta: string;
	FechaAlta: string;
	UserMod: string;
	FechaMod: string;
	UserBaja: string;
	FechaBaja: string;
	createdAt?: string;
	updatedAt?: string;
}