import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { MULTER_OPTIONS, BASE_URL } from './../../app.config';
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Body } from '@nestjs/common';
import { diskStorage } from 'multer';
import { HttpProcessor } from '@/decotators/http.decotator';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { SlsService } from '@/providers/sls/sls.service';

@ApiUseTags('公共')
@Controller('common')
export class CommonController {
  constructor(private readonly slsService: SlsService) {}

  @HttpProcessor.handle('test')
  @Post('/test')
  test(@Body() body: any): Promise<any> {
    return this.slsService.query(body);
  }

  @ApiOperation({ title: '上传文件', description: '' })
  @HttpProcessor.handle('上传文件')
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MULTER_OPTIONS.fileSize
      },
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = MULTER_OPTIONS.path;
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
        }
      })
    })
  )
  async fileUpload(@UploadedFile() file) {
    return {
      url: BASE_URL.serverUrl + '/public/uploads/' + file.filename,
      filename: file.originalname
    };
  }
}
