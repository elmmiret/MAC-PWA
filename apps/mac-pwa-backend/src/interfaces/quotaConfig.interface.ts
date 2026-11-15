import type {
    CreateQuotaConfigDTO,
    DeleteQuotaConfigsDTO,
    AddTemporadesQuotaConfigDTO,
    QuotaConfigResponseDTO,
    RemoveTemporadesQuotaConfigDTO,
    UpdateQuotaConfigDTO,
} from 'shared';

export interface IQuotaConfigService {
    create(dto: CreateQuotaConfigDTO): Promise<QuotaConfigResponseDTO>;
    deleteMany(dto: DeleteQuotaConfigsDTO): Promise<void>;
    update(id: string, dto: UpdateQuotaConfigDTO): Promise<QuotaConfigResponseDTO>;
    addTemporades(id: string, dto: AddTemporadesQuotaConfigDTO): Promise<QuotaConfigResponseDTO>;
    removeTemporades(id: string, dto: RemoveTemporadesQuotaConfigDTO): Promise<{ quotaConfig: QuotaConfigResponseDTO; removed: string[]; notFound: string[] }>;
    activate(id: string): Promise<QuotaConfigResponseDTO>;
    deactivate(id: string): Promise<QuotaConfigResponseDTO>;
    getById(id: string): Promise<QuotaConfigResponseDTO>;
    getByName(nom: string): Promise<QuotaConfigResponseDTO>;
    getByType(tipus: string): Promise<QuotaConfigResponseDTO[]>;
    getAll(): Promise<QuotaConfigResponseDTO[]>;
}
