import { QueryMetadataListDto, AddMetadataDto, UpdateMetadataDto, QueryFieldListDto, AddMetadataTagDto, QueryMetadataTagListDto } from './metadata.dto';
import { MetadataModel, FieldModel, MetadataTagModel } from './metadata.model';
import { Repository } from 'typeorm';
import { QueryListQuery, PageData } from '@/interfaces/request.interface';
export declare class MetadataService {
    private readonly metadataModel;
    private readonly metadataTagModel;
    private readonly fieldModel;
    constructor(metadataModel: Repository<MetadataModel>, metadataTagModel: Repository<MetadataTagModel>, fieldModel: Repository<FieldModel>);
    getFields(query: QueryListQuery<QueryFieldListDto>): Promise<PageData<FieldModel>>;
    getActiveFields(query: any): Promise<any>;
    getMetadataList(query: QueryListQuery<QueryMetadataListDto>): Promise<PageData<MetadataModel>>;
    addMetadata(body: AddMetadataDto): Promise<void>;
    updateMetadata(body: UpdateMetadataDto): Promise<void>;
    deleteMetadata(id: number): Promise<void>;
    enableMetadata(id: number): Promise<void>;
    disableMetadata(id: number): Promise<void>;
    addMetadataTag(body: AddMetadataTagDto): Promise<void>;
    getMetadataTags(query: QueryListQuery<QueryMetadataTagListDto>): Promise<PageData<MetadataTagModel>>;
}
