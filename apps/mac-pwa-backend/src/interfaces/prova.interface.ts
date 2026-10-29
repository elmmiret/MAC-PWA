import { Prova } from "@prisma/client";

export interface IProvaService {
    getById(id: string): Promise<Prova | null>;
    getByNom(nom: string): Promise<Prova | null>;
    //createProva(data: CreateProvaDTO): Promise<Prova>;
    //updateProva(data: UpdateProvaDTO): Promise<Prova>;
    deleteProves(id: string[]): Promise<void>;
}