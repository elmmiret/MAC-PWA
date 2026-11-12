import type {
    CreatePagamentsByCategoriesDTO,
    DeletePagamentsDTO,
    PagamentResponseDTO,
    UpdatePagamentsEstatDTO,
} from 'shared';

export interface IPagamentService {
    createByCategories(type: string, dto: CreatePagamentsByCategoriesDTO): Promise<PagamentResponseDTO[]>;
    markPaid(dto: UpdatePagamentsEstatDTO): Promise<number>;
    markCanceled(dto: UpdatePagamentsEstatDTO): Promise<number>;
    deleteMany(dto: DeletePagamentsDTO): Promise<number>;
    getByUsuariId(usuariId: string): Promise<PagamentResponseDTO[]>;
}
