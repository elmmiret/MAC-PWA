import { QuotaConfig, TQuota} from "@prisma/client";

export interface IQuotaConfigService {
    getById(id: string): Promise<QuotaConfig | null>;
    getByTipus(tipus: TQuota): Promise<QuotaConfig[]>;
    //createQuotaConfig(data: CreateQuotaConfigDTO): Promise<QuotaConfig>;
    //updateQuotaConfig(data: UpdateQuotaConfigDTO): Promise<QuotaConfig>;
    deleteQuotaConfigs(id: string[]): Promise<void>;
}