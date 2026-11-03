import type {
    CreateQuotaConfigDTO,
    DeleteQuotaConfigsDTO,
    AddTemporadesQuotaConfigDTO,
    QuotaConfigResponseDTO,
    UpdateQuotaConfigDTO,
} from 'shared';

export interface IQuotaConfigService {
    create(dto: CreateQuotaConfigDTO): Promise<QuotaConfigResponseDTO>;
    deleteMany(dto: DeleteQuotaConfigsDTO): Promise<void>;
    update(id: string, dto: UpdateQuotaConfigDTO): Promise<QuotaConfigResponseDTO>;
    addTemporades(id: string, dto: AddTemporadesQuotaConfigDTO): Promise<QuotaConfigResponseDTO>;
    activate(id: string): Promise<QuotaConfigResponseDTO>;
    deactivate(id: string): Promise<QuotaConfigResponseDTO>;
    getById(id: string): Promise<QuotaConfigResponseDTO>;
    getByName(nom: string): Promise<QuotaConfigResponseDTO>;
    getByType(tipus: string): Promise<QuotaConfigResponseDTO[]>;
    getByCategory(categoriaId: string): Promise<QuotaConfigResponseDTO[]>;
}
