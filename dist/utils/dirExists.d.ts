/// <reference types="node" />
import * as fs from 'fs';
declare function getStat(path: string): Promise<fs.Stats | false>;
declare function mkdir(dir: string): Promise<boolean>;
declare function dirExists(dir: string): Promise<any>;
export { dirExists, getStat, mkdir };
