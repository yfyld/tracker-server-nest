/// <reference types="mongoose-paginate" />
import { ModelType } from 'typegoose';
import { PaginateModel, Document } from 'mongoose';
export declare type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>;
