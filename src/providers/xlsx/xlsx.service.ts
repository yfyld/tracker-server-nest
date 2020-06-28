import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Injectable, HttpService } from '@nestjs/common';
import xlsx from 'node-xlsx';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class XlsxService {
  constructor(private readonly httpService: HttpService) {}

  private download(url: string): Observable<AxiosResponse<any>> {
    return this.httpService.get(url);
  }

  private getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  public async exportExcel(): Promise<[Readable, number]> {
    const data = [
      [1, 2, 3],
      [true, false, null, 'sheetjs'],
      ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
      ['baz', null, 'qux']
    ];
    var buffer = xlsx.build([{ name: 'sheet1', data: data }]);

    return [this.getReadableStream(buffer), buffer.length];
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
