import { ProjectModel } from '../project/project.model';
export declare class MetadataTagModel {
    id: number;
    name: string;
    description: string;
    project: ProjectModel;
}
export declare class FieldModel {
    id: number;
    code: string;
    type: string;
    status: number;
    name: string;
}
export declare class MetadataModel {
    id: number;
    name: string;
    code: string;
    type: number;
    status: number;
    description: string;
    project: ProjectModel;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: MetadataTagModel[];
}
