import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  ping(): { success: boolean } {
    return {
      success: true,
    };
  }

  @Get('posts')
  @UseInterceptors(CacheInterceptor)
  async getPosts(@Query() query): Promise<any> {
    return this.appService.getPosts(query);
  }
}
