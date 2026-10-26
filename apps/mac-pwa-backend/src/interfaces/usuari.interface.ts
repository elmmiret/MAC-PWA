import { Usuari } from "@prisma/client";

export interface IUsuariService {
    getById(id: string): Promise<Usuari | null>;
    getByCategoria(nomCategoria: string): Promise<Usuari[]>;
    //createUsuari(data: CreateUsuariDTO): Promise<Usuari>;
    //updateUsuari(data: UpdateUsuariDTO): Promise<Usuari>;
    deleteUsuaris(id: string[]): Promise<void>;
}