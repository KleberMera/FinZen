
export interface Categorias {
    id: number;
    nombre: string;
    tipo: string;
    usuario_id: number;
}


export interface CategoriasResponse {
    message: string;
    data: Categorias[];
}
