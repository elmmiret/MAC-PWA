import { Ranking, TSexe } from "@prisma/client";

export interface IRankingService {
    getAll(): Promise<Ranking[]>;
    getById(id: string): Promise<Ranking | null>;
    getByProva(nom: string): Promise<Ranking[]>;
    getBySexe(sexe: TSexe): Promise<Ranking[]>;
    getByProvaAndSexe(nom: string, sexe: TSexe): Promise<Ranking[]>;
    //createRanking(data: CreateRankingDTO): Promise<Ranking>;
    //updateRanking(data: UpdateRankingDTO): Promise<Ranking>;
    deleteRankings(id: string[]): Promise<void>;
}