export interface PageData<T> {
    totalCount: number;
    list: T[];
}
export declare type PageQuery<T> = {
    page: number;
    pageSize: number;
} & T;
export declare enum Sort {
    DESC = "DESC",
    ASC = "ASC",
    DEFAULT = ""
}
export interface SortQuery {
    sort: Sort;
    sortKey: string;
}
export interface QueryListQuery<T> {
    skip: number;
    take: number;
    query: T;
    sort: {
        [propName: string]: Sort;
    };
}
