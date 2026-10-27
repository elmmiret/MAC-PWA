import { Usuari } from "@prisma/client";

export interface IUsuariService {
    getById(id: string): Promise<Usuari | null>;
    getByCategoria(nomCategoria: string): Promise<Usuari[]>;
    deleteUsuaris(id: string[]): Promise<void>;
}