import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Injectable, HttpService } from '@nestjs/common';
import xlsx from 'node-xlsx';

@Injectable()
export class XlsxService {
  constructor(private readonly httpService: HttpService) {}

  private download(url: string): Observable<AxiosResponse<any>> {
    return this.httpService.get(url);
  }

  public async parseByPath(path: string, name: string[], key: string[]): Promise<{ [prop: string]: any }[]> {
    const data = xlsx.parse(path);
    if (
      !data ||
      !data.length ||
      !data[0].data ||
      !data[0].data.length ||
      JSON.stringify(data[0].data[0]) !== JSON.stringify(name)
    ) {
      throw 'excel 格式不对';
    }
    const sheetData: string[][] = data[0].data;
    return sheetData.slice(1).map(item => {
      return key.reduce((total, val, index) => {
        total[val] = item[index];
        return total;
      }, {});
    });
  }
}
