import type {
    CreateProvaDTO,
    DeleteProvasDTO,
    ProvaResponseDTO,
} from 'shared';

export interface IProvaService {
    create(dto: CreateProvaDTO): Promise<ProvaResponseDTO>;
    getAll(): Promise<ProvaResponseDTO[]>;
    deleteMany(dto: DeleteProvasDTO): Promise<void>;
}
