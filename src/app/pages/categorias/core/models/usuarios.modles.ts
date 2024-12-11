

export interface Usuarios {
    id: number;
    rol_id: number;
    nombre: string;
    apellido: string;
    email: string;
    fecha_registro: string;
    ultimo_inicio_sesion: string;
    activo: number;
    rol_nombre: string;
}


export interface UsuariosResponse {
    message: string;
    data: Usuarios[];
}