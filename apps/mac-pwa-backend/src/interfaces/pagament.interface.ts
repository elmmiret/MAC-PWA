import { Pagament, TEstat} from "@prisma/client";

export interface IPagamentService {
    getByUserId(userId: string): Promise<Pagament[]>;
    getById(id: string): Promise<Pagament | null>;
    getByEstat(estat: TEstat): Promise<Pagament[]>;
    getByUserIdAndEstat(userId: string, estat: TEstat): Promise<Pagament[]>;
    //createPagament(data: CreatePagamentDTO): Promise<Pagament>;
    //updatePagament(data: UpdatePagamentDTO): Promise<Pagament>;
    deletePagaments(id: string[]): Promise<void>;
}