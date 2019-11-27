import { ProjectModel } from '../project/project.model';
export declare class AddMetadataDto {
    code: string;
    name: string;
    type: number;
    description?: string;
    status: number;
    tags: number[];
    newTags?: string[];
    projectId: number;
}
export declare class UpdateMetadataDto {
    id: number;
    code: string;
    name: string;
    type: number;
    description?: string;
    status: number;
    tags: number[];
    newTags?: string[];
    projectId: number;
}
export declare class MetadataDto {
    name: string;
    id: string;
    type: string;
    level: number;
    status: number;
    message: string;
    url: string;
    version?: string;
    project: ProjectModel | {
        id: number;
    };
}
export declare class QueryMetadataListDto {
    projectId: string;
    status: number;
    name: string;
    type: string[];
}
export declare class AddMetadataTagDto {
    name: string;
    description?: string;
    projectId: number;
}
export declare class QueryMetadataTagListDto {
    projectId: number;
}
export declare class SourceCodeDto {
    code: string;
    line: number;
    column: number;
    sourceUrl: string;
    name: string;
}
export declare class QueryFieldListDto {
    projectId: number;
    type: number;
    status: number;
    name?: string;
}
