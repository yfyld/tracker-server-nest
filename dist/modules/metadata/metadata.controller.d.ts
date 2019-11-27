import { QueryListQuery } from '@/interfaces/request.interface';
import { PageData } from '../../interfaces/request.interface';
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { MetadataService } from './metadata.service';
import { QueryMetadataListDto, AddMetadataTagDto, UpdateMetadataDto, AddMetadataDto, QueryFieldListDto, QueryMetadataTagListDto } from './metadata.dto';
export declare class MetadataController {
    private readonly metadataService;
    constructor(metadataService: MetadataService);
    addMetadata(body: AddMetadataDto): Promise<void>;
    updateMetadata(body: UpdateMetadataDto): Promise<void>;
    deleteMetadata(metadataId: number): Promise<void>;
    enableMetadata(metadataId: number): Promise<void>;
    disableMetadata(metadataId: number): Promise<void>;
    getMetadataList(query: QueryListQuery<QueryMetadataListDto>): Promise<PageData<MetadataModel>>;
    getFields(query: QueryListQuery<QueryFieldListDto>): Promise<PageData<FieldModel>>;
    getActiveFields(query: any): Promise<FieldModel>;
    addMetadataTag(body: AddMetadataTagDto): Promise<void>;
    getMetadataTags(query: QueryListQuery<QueryMetadataTagListDto>): Promise<PageData<MetadataTagModel>>;
}
