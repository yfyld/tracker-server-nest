import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { MULTER_OPTIONS, BASE_URL } from './../../app.config';
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Body, Req } from '@nestjs/common';
import { diskStorage } from 'multer';
import { HttpProcessor } from '@/decotators/http.decotator';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { SlsService } from '@/providers/sls/sls.service';
import { request } from 'request';
import { PageTypes } from '@/constants/common.constant';

@ApiUseTags('公共')
@Controller('common')
export class CommonController {
  constructor(private readonly slsService: SlsService) {}

  @HttpProcessor.handle('获取页面类型列表')
  @Get('/pageTypes')
  // @Permissions(PERMISSION_CODE.METADATA_ADD)
  getPageTypes() {
    return PageTypes;
  }

  @ApiOperation({ title: '上传文件', description: '' })
  @HttpProcessor.handle('上传文件')
  @Post('/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     limits: {
  //       fileSize: MULTER_OPTIONS.fileSize
  //     },
  //     storage: diskStorage({
  //       destination: (req: any, file: any, cb: any) => {
  //         const uploadPath = MULTER_OPTIONS.path;
  //         if (!existsSync(uploadPath)) {
  //           mkdirSync(uploadPath);
  //         }
  //         cb(null, uploadPath);
  //       },
  //       filename: (req: any, file: any, cb: any) => {
  //         cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
  //       }
  //     })
  //   })
  // )
  async fileUpload(@Req() req) {
    const request = require('request');
    const res = await req.pipe(request.post(`https://apigw.91jkys.com/api/spider-fileupload/1.0/upload`)); // 这里请求真正的接口
    var response = [];

    return new Promise((resolve, reject) => {
      res.on('data', function(chunk) {
        response.push(chunk);
      });

      res.on('end', function() {
        const data = JSON.parse(response.toString());
        resolve({
          path: data.result.relativePath,
          url: data.result.fullPath,
          filename: data.result.fileName
        });
      });
    });

    // return {
    //   url: BASE_URL.serverUrl + '/public/uploads/' + file.filename,
    //   path: '/public/uploads/' + file.filename,
    //   filename: file.originalname
    // };
  }
}
